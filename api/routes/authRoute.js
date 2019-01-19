const express = require('express')
// const { clearCookie } = require('../utils/authUtil')
const admin = require('../../services/firebase-admin-init.js')

const keySecret = process.env.SECRET_KEY
const stripe = require('stripe')(keySecret)
const expiresIn = 60 * 1000 * 5 // 10 min
var router = express.Router()
const { DateTime } = require('luxon')
const { taskMap } = require('../../services/map.1')
var db = admin.database()
var ref = db.ref('users')

const checkSession = function(req, res, next) {
  const sessionCookie = req.session.sessionCookie || ''
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(decodedData => {
      const decodedClaims = {
        uid: decodedData.uid,
        email: decodedData.email,
        emailVerified: decodedData.emailVerified,
        phoneNumber: decodedData.phoneNumber
      }
      res.locals.decodedClaims = decodedClaims
      next()
    })
    .catch(() => {
      console.log('expired')
      res.clearCookie('session')
      res.clearCookie('idToken')
      res.locals = {}
      res.status(401).send('UNAUTHORIZED REQUEST!')
    })
}

router.get('/', (req, res, next) => {
  const sessionCookie = req.session.sessionCookie || ''
  if (sessionCookie) {
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(decodedData => {
        const decodedClaims = {
          uid: decodedData.uid,
          email: decodedData.email,
          emailVerified: decodedData.email_verified,
          phoneNumber: decodedData.phone_number
        }
        res.locals.decodedClaims = decodedClaims
        console.log('laaaaaaaa')
      })
      .catch(() => {
        console.log('expired')
        res.clearCookie('session')
        res.clearCookie('idToken')
        res.locals = null
      })
      .finally(() => {
        next()
      })
  } else {
    next()
  }
})

router.post('/profile', checkSession, (req, res) => {
  // Verify the session cookie. In this case an additional check is added to detect
  // if the user's Firebase session was revoked, user deleted/disabled, etc.
  res.status(200).send('ok')
})

router.post('/order', checkSession, (req, res) => {
  // Verify the session cookie. In this case an additional check is added to detect
  // if the user's Firebase session was revoked, user deleted/disabled, etc.
  var sessData = req.session
  const order = req.body.order
  sessData.order = order
  const time = DateTime.fromMillis(order.time)
  const date = DateTime.fromMillis(order.date)
  const dateObj = getStringFromDate(date)

  const address = order.address
  const addressStr = address['street_number']
    .concat(' ')
    .concat(address['route'])
    .concat(' ')
    .concat(address['locality'])

  const hours = time.get('hour')
  const minutes = time.get('minute') == 0 ? 0 : 0.5
  const price = 3000 * (hours + minutes)
  // console.log(price)
  if (hours <= 0) {
    res.sendStatus(500)
    return
  }
  res.send({ price })
})

function getStringFromDate(date) {
  const weekdayLong = date.get('weekdayLong')
  const day = date.get('day')
  const monthLong = date.get('monthLong')
  const year = date.get('year')
  const hours = date.get('hour')
  const minutes = date.get('minute')
  return { weekdayLong, day, monthLong, year, hours, minutes }
}

router.get('/getorders', (req, res) => {
  const sessionCookie = req.session.sessionCookie || ''
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(decodedClaims => {
      const orders = []
      db.ref('/users/' + decodedClaims.uid).once(
        'value',
        function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            const copyChild = childSnapshot.exportVal()
            delete copyChild.customer
            orders.push(copyChild)
          })
          orders.sort(function(a, b) {
            return b.orders.sinceDate - a.orders.sinceDate
          })
          res.status(200).send(orders)
        },
        function(errorObject) {
          console.log('The read failed: ' + errorObject.code)
        }
      )
    })
    .catch(err => {
      console.log(err)
      res.status(401).send('UNAUTHORIZED REQUEST!')
    })
})

router.post('/processpayment', (req, res) => {
  const order = req.body.order
  const sessionCookie = req.session.sessionCookie || ''
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(decodedClaims => {
      const time = DateTime.fromMillis(order.time)
      const date = DateTime.fromMillis(order.date)
      const dateObj = getStringFromDate(date)

      const address = order.address
      const addressStr = address['street_number']
        .concat(' ')
        .concat(address['route'])
        .concat(' ')
        .concat(address['locality'])

      const hours = time.get('hour')
      const minutes = time.get('minute') == 0 ? 0 : 0.5

      const description = taskMap
        .get(order.task)
        .concat(';')
        .concat(hours)
        .concat('h')
        .concat(time.get('minute'))
        .concat(';')
        .concat(dateObj['weekdayLong'])
        .concat(' ')
        .concat(dateObj['day'])
        .concat(' ')
        .concat(dateObj['monthLong'])
        .concat(' ')
        .concat(dateObj['year'])
        .concat(' ')
        .concat(dateObj['hours'])
        .concat('h')
        .concat(dateObj['minutes'])
        .concat(';')
        .concat(addressStr)

      const price = 3000 * (hours + minutes)
      // console.log(price)

      let amount = price
      return stripe.customers
        .create({
          email: req.body.order.email,
          source: req.body.order.token.id
        })
        .then(customer => {
          var usersRef = ref.child(decodedClaims.uid)
          usersRef
            .push()
            .set({
              orders: req.body.order,
              customer: customer
            })
            .then(() => {
              console.log(customer)
            })
            .catch(err => {
              console.log(err)
            })
        })
    })
    .then(() => {
      res
        .status(200)
        .send(
          "Paiement enregistré. Vous serez débité après que nous vous ayons rendu visite. Nous recherchons activement une aide ménagère. Si aucune aide ménagère n'est trouvée dans 2 heures , vous ne serez pas débité!"
        )
    })
    .catch(err => {
      console.log(err)
      res.status(403).send("can't process payment")
    })
})

router.get('/booktaskMobile', (req, res, next) => {
  const sessionCookie = req.session.sessionCookie || ''
  if (sessionCookie) {
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(decodedData => {
        const decodedClaims = {
          uid: decodedData.uid,
          email: decodedData.email,
          emailVerified: decodedData.email_verified,
          phoneNumber: decodedData.phone_number
        }
        res.locals.decodedClaims = decodedClaims
        next()
      })
      .catch(() => {
        res.redirect('/login')
      })
  } else {
    res.redirect('/login')
  }
})

router.get('/confirmbooking', (req, res, next) => {
  const sessionCookie = req.session.sessionCookie || ''
  if (sessionCookie) {
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(decodedData => {
        const decodedClaims = {
          uid: decodedData.uid,
          email: decodedData.email,
          emailVerified: decodedData.email_verified,
          phoneNumber: decodedData.phone_number
        }
        res.locals.decodedClaims = decodedClaims
        next()
      })
      .catch(() => {
        console.log('expired confirmbooking')
        res.redirect('/login')
      })
  } else {
    res.redirect('/login')
  }
})

router.get('/bookmobile', (req, res, next) => {
  const sessionCookie = req.session.sessionCookie || ''
  if (sessionCookie) {
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(decodedData => {
        const decodedClaims = {
          uid: decodedData.uid,
          email: decodedData.email,
          emailVerified: decodedData.email_verified,
          phoneNumber: decodedData.phone_number
        }
        res.locals.decodedClaims = decodedClaims
        next()
      })
      .catch(() => {
        console.log('expired book')
        res.redirect('/login')
      })
  } else {
    res.redirect('/login')
  }
})

router.get('/book', (req, res, next) => {
  const sessionCookie = req.session.sessionCookie || ''
  if (sessionCookie) {
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(decodedData => {
        const decodedClaims = {
          uid: decodedData.uid,
          email: decodedData.email,
          emailVerified: decodedData.email_verified,
          phoneNumber: decodedData.phone_number
        }
        res.locals.decodedClaims = decodedClaims
        next()
      })
      .catch(() => {
        console.log('expired book')
        res.redirect('/login')
      })
  } else {
    res.redirect('/login')
  }
})

router.get('/payment', (req, res, next) => {
  const sessionCookie = req.session.sessionCookie || ''
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(decodedClaims => {
      res.locals.decodedClaims = decodedClaims
      var sessData = req.session
      const order = sessData.order
      const time = DateTime.fromMillis(order.time)
      const date = DateTime.fromMillis(order.date)
      const dateObj = getStringFromDate(date)

      const address = order.address
      const addressStr = address['street_number']
        .concat(' ')
        .concat(address['route'])
        .concat(' ')
        .concat(address['locality'])

      const hours = time.get('hour')
      const minutes = time.get('minute') == 0 ? 0 : 0.5
      const price = 2500 * (hours + minutes)
      if (hours <= 0) {
        res.sendStatus(500)
        return
      }
      res.locals.price = price

      next()
    })
    .catch(error => {
      res.redirect('/login')
    })
})

router.get('/verifySession', checkSession, (req, res) => {
  console.log('verifySession')
  const sessionCookie = req.session.sessionCookie || ''
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(decodedClaims => {
      res.locals.decodedClaims = decodedClaims
      res.status(200).send('ok')
    })
    .catch(error => {
      res.status(401).send('UNAUTHORIZED REQUEST!')
    })
})

router.post('/sessionToken', function(req, res) {
  const idToken = req.body.idToken
  if (!idToken) {
    res.status(401).send('UNAUTHORIZED REQUEST!')
    return
  }
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(function(decodedToken) {
      var uid = decodedToken.uid
      return admin.auth().getUser(uid)
    })
    .then(function(userRecord) {
      console.log('new log in')
      const decodedClaims = {
        uid: userRecord.uid,
        email: userRecord.email,
        emailVerified: userRecord.emailVerified,
        phoneNumber: userRecord.phoneNumber
      }
      res.locals.decodedClaims = decodedClaims
      return admin.auth().createSessionCookie(idToken, { expiresIn })
    })
    .then(sessionCookie => {
      // Set cookie policy for session cookie.
      var sessData = req.session
      sessData.sessionCookie = sessionCookie
      res.set('Content-Type', 'application/json')
      res.end(JSON.stringify({ status: 'success' }))
    })
    .catch(error => {
      console.log(error)
      res.clearCookie('session')
      res.clearCookie('idToken')
      res.locals = {}
      res.status(401).send('UNAUTHORIZED REQUEST!')
    })
})

router.post('/sessionLogout', (req, res) => {
  res.clearCookie('session')
  res.redirect('/login')
})
module.exports = router
