const express = require('express')
// const { clearCookie } = require('../utils/authUtil')
const admin = require('../../services/firebase-admin-init.js')

const keySecret = process.env.SECRET_KEY
const stripe = require('stripe')(keySecret)
const expiresIn = 60 * 1000 * 20 // 10 min
var router = express.Router()
const { DateTime, Settings } = require('luxon')
const { taskMap } = require('../../services/map.1')
var db = admin.database()
var ref = db.ref('users')
Settings.defaultLocale = 'fr'
Settings.defaultZoneName = 'Europe/Paris'
console.log(Settings.defaultZone)

const price = 2000

const checkSession = function(req, res, next) {
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
        next()
      })
      .catch(() => {
        console.log('expired')
        res.clearCookie('session')
        res.clearCookie('idToken')
        res.status(401).send('UNAUTHORIZED REQUEST!')
      })
  } else {
    res.status(403).send('FORBIDDENT REQUEST!')
  }
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

router.get('/getorders', checkSession, (req, res) => {
  const orders = []
  db.ref('/users/' + req.session.decodedClaims.uid).once(
    'value',
    function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        const copyChild = childSnapshot.exportVal()
        if (copyChild && copyChild.order) {
          if (copyChild.order.status != 'removed') {
            orders.push(copyChild.order)
          }
        }
      })
      orders.sort(function(a, b) {
        if (b) {
          return b.sinceDate - a.sinceDate
        }
        return 1
      })
      res.status(200).send(orders)
    },
    function(errorObject) {
      console.log('The read failed: ' + errorObject.code)
      res.status(401).send('UNAUTHORIZED REQUEST!')
    }
  )
})

router.post('/preparepaiement', checkSession, (req, res) => {
  const order = req.body.order
  const time = DateTime.fromISO(order.time, { zone: 'Europe/Paris' })
  const date = DateTime.fromISO(order.date, { zone: 'Europe/Paris' })
  const hour = time.hour
  const minute = time.minute == 30 ? 0.5 : 0
  if (hour + minute < 1) {
    res.status(400).send('UNAUTHORIZED REQUEST!')
  } else {
    res.status(200).send({
      price: hour * price + minute * price,
      hour,
      minute,
      zone: time.get('defaultZone')
    })
  }
})

router.post('/cancelorder', checkSession, (req, res) => {
  const order = req.body.order
  const usersRef = ref.child(req.session.decodedClaims.uid)
  usersRef
    .child(order.idOrder)
    .child('order')
    .update({
      status: 'removed'
    })
    .then(() => {
      res.status(200).send('Order removed')
    })
    .catch(err => {
      res.status(500).send('Internal error!')
    })
})

router.post('/processpayment', checkSession, (req, res) => {
  const order = req.body.order
  const time = DateTime.fromISO(order.time, { zone: 'Europe/Paris' })
  const date = DateTime.fromISO(order.date, { zone: 'Europe/Paris' })
  const hour = time.hour
  const minute = time.minute == 30 ? 0.5 : 0
  if (hour + minute < 1) {
    res.status(400).send('UNAUTHORIZED REQUEST!')
  } else {
    order.sinceDate = DateTime.local()
      .setZone('Europe/Paris')
      .toMillis()
    order.time = time.toMillis()
    order.date = date.toMillis()
    order.status = 'waiting'
    const usersRef = ref.child(req.session.decodedClaims.uid)
    usersRef
      .once('value')
      .then(function(dataSnapshot) {
        const userData = dataSnapshot.val()
        if (userData && userData.customer) {
          const customerId = userData.customer.id
          if (userData.customer.id) {
            return stripe.customers.retrieve(customerId).then(() => {
              var refObj = usersRef.push()
              var postId = refObj.key
              order.idOrder = postId
              return refObj.set({
                order
              })
            })
          }
        } else {
          return stripe.customers
            .create({
              email: order.email,
              source: order.token.id
            })
            .then(customer => {
              usersRef
                .set({
                  customer
                })
                .then(() => {
                  var refObj = usersRef.push()
                  var postId = refObj.key
                  order.idOrder = postId
                  return refObj.set({
                    order
                  })
                })
            })
        }
      })
      .then(() => {
        res
          .status(200)
          .send(
            'Paiement enregistré. Vous serez débité après que nous vous ayons rendu visite! Nous vous contacterons quand nous auront trouvé une femme de ménage.'
          )
      })
      .catch(err => {
        if (err.code === 'resource_missing') {
          res.status(500).send('Internal error!')
        }
        res.status(401).send('UNAUTHORIZED REQUEST!')
      })
  }
})

router.get('/verifySession', checkSession, (req, res) => {
  res.status(200).send({ verifySession: 'true' })
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
