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

const price = 2000

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
      req.session.decodedClaims = decodedClaims
      next()
    })
    .catch(() => {
      console.log('expired')
      res.clearCookie('session')
      res.clearCookie('idToken')
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
        req.session.decodedClaims = decodedClaims
      })
      .catch(() => {
        console.log('expired')
        res.clearCookie('session')
        res.clearCookie('idToken')
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

router.get('/getorders', checkSession, (req, res) => {
  const orders = []
  db.ref('/users/' + req.session.decodedClaims.uid).once(
    'value',
    function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        const copyChild = childSnapshot.exportVal()
        delete copyChild.customer
        orders.push(copyChild)
      })
      orders.sort(function(a, b) {
        return b.order.sinceDate - a.order.sinceDate
      })
      res.status(200).send(orders)
    },
    function(errorObject) {
      console.log('The read failed: ' + errorObject.code)
      res.status(400).send('UNAUTHORIZED REQUEST!')
    }
  )
})

router.post('/preparepaiement', checkSession, (req, res) => {
  const order = req.body.order
  const time = DateTime.fromISO(order.time)
  const date = DateTime.fromISO(order.date)
  const hour = time.hour
  const minute = time.minute == 30 ? 0.5 : 0
  if (hour + minute < 1) {
    res.status(400).send('UNAUTHORIZED REQUEST!')
  } else {
    res.status(200).send({ price: hour * price + minute * price })
  }
})

router.post('/processpayment', checkSession, (req, res) => {
  const order = req.body.order
  const time = DateTime.fromISO(order.time)
  const date = DateTime.fromISO(order.date)
  const hour = time.hour
  const minute = time.minute == 30 ? 0.5 : 0
  if (hour + minute < 1) {
    res.status(400).send('UNAUTHORIZED REQUEST!')
  } else {
    stripe.customers
      .create({
        email: order.email,
        source: order.token.id
      })
      .then(customer => {
        var usersRef = ref.child(req.session.decodedClaims.uid)
        order.sinceDate = DateTime.local().toMillis()
        order.time = time.toMillis()
        order.date = date.toMillis()
        order.status = 'waiting'
        return usersRef.push().set({
          order: order,
          customer: customer
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
        res.status(400).send('UNAUTHORIZED REQUEST!')
      })
  }
})

router.get('/verifySession', checkSession, (req, res) => {
  console.log('verifySession')
  const sessionCookie = req.session.sessionCookie || ''
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(decodedClaims => {
      req.session.decodedClaims = decodedClaims
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
      req.session.decodedClaims = decodedClaims
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
      res.status(401).send('UNAUTHORIZED REQUEST!')
    })
})

router.post('/sessionLogout', (req, res) => {
  res.clearCookie('session')
  res.redirect('/login')
})
module.exports = router
