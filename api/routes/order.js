const express = require('express')
const keySecret = process.env.SECRET_KEY
const stripe = require('stripe')(keySecret)
const router = express.Router()
const { formatDescriptionFromOrder } = require('../utils/formatter')
const { DateTime, Settings } = require('luxon')
Settings.defaultLocale = 'fr'
Settings.defaultZoneName = 'Europe/Paris'
const price = 2000
const { clearCookie } = require('../utils/authUtil')

const checkOrder = (req, res, next) => {
  const order = req.body.order
  if (
    !req.session.decodedClaims.uid ||
    !order ||
    !(order.address && order.time && order.date && order.task)
  ) {
    res.status(400).send('BAD REQUEST!')
    return
  }
  const time = DateTime.fromMillis(order.time)
  const date = DateTime.fromMillis(order.date)
  const now = DateTime.local()
  const hour = time.hour
  const minute = time.minute == 30 ? 0.5 : 0
  if (hour + minute < 1 && date.isBefore(now)) {
    res.status(400).send('BAD REQUEST!')
  } else {
    next()
  }
}

module.exports = function(admin) {
  const { checkCookieSession } = require('../middle/authmiddleware')(admin)
  const checkSession = (req, res, next) => {
    const sessionCookie = req.session.sessionCookie || ''
    if (sessionCookie) {
      checkCookieSession(req, sessionCookie)
        .then(() => {
          next()
        })
        .catch(() => {
          clearCookie(res)
          res.status(401).send('UNAUTHORIZED REQUEST!')
        })
    } else {
      res.status(403).send('FORBIDDENT REQUEST!')
    }
  }

  const db = admin.database()
  const ref = db.ref('users')
  const ordersRef = db.ref('orders')
  router.use(checkSession)
  /*
  
  const createStripeCustomer = (usersRef, order) => {
    if (!order || !usersRef) {
      throw new Error('an argument is null')
    }
    return stripe.customers
      .create({
        email: order.email,
        source: order.token.id
      })
      .then(customer => {
        return usersRef.set({
          customerId: customer.id
        })
      })
  }
  const retrieveCustomer = (customerId, order) => {
    if (!order || !customerId) {
      throw new Error('an argument is null')
    }
    return stripe.customers.retrieve(customerId).then(customer => {
      /*const newCard = !customer.sources.data
        .map(data => data.id)
        .includes(order.token.card.id)
      return stripe.customers.createSource(customerId, {
        source: order.token.id
      })
    })
  }*/

  router.post('/preparepaiement', checkOrder, (req, res) => {
    res.status(200).send({
      price
    })
  })

  router.post('/processpayment', checkOrder, (req, res) => {
    const order = req.body.order
    const now = DateTime.local()
    order.sinceDate = now.toMillis()
    const time = DateTime.fromMillis(order.time)
    const hour = time.hour
    const minute = time.minute == 30 ? 0.5 : 0
    if (!req.session.decodedClaims.uid) {
      res.status(400).send('BAD REQUEST!')
      return
    }
    const usersRef = ref.child(req.session.decodedClaims.uid)
    usersRef
      .once('value')
      .then(function(dataSnapshot) {
        const userData = dataSnapshot.val()
        order.idStoken = order.token.card.id
        if (userData && userData.customerId) {
          const customerId = userData.customerId
          return stripe.customers.retrieve(customerId).then(() => {
            return stripe.customers.createSource(customerId, {
              source: order.token.id
            })
          })
        } else {
          return stripe.customers
            .create({
              email: order.email,
              source: order.token.id
            })
            .then(customer => {
              return usersRef.set({
                customerId: customer.id
              })
            })
        }
      })
      .then(() => {
        order.token = null
        var refObj = usersRef.push()
        var postId = refObj.key
        order.idOrder = postId
        order.price = hour * price + minute * price
        order.status = 'waiting'
        const refOrder = usersRef.child(postId + '/order')
        refOrder.on('child_changed', function(snapshot) {
          var changedPost = snapshot.val()
          console.log('The updated post title is ' + changedPost)

          /*admin
            .auth()
            .getUser(req.session.decodedClaims.uid)
            .then(userRecord => {
              console.log(userRecord)
              console.log('The updated post title is ' + changedPost)
            })
            .catch(err => {
              console.log(err)
            })*/
        })
        return refObj
          .set({
            order
          })
          .then(() => {
            return ordersRef.child(postId).set({
              users: req.session.decodedClaims.uid
            })
          })
      })
      .then(() => {
        res.status(200).send('Paiement enregistré.')
      })
      .catch(err => {
        console.log(err)
        if (
          err.code === 'resource_missing' ||
          err.code === 'PERMISSION_DENIED'
        ) {
          res.status(500).send('Internal error!')
          return
        }
        res.status(401).send('UNAUTHORIZED REQUEST!')
      })
  })

  router.post('/processoldpayment', checkOrder, (req, res) => {
    const usersRef = ref.child(req.session.decodedClaims.uid)
    const order = req.body.order
    usersRef
      .once('value')
      .then(function(dataSnapshot) {
        const userData = dataSnapshot.val()
        order.idStoken = order.token.card.id
        const customerId = userData.customerId
        if (!customerId) {
          throw new Error('no CustomerId, corrumption')
        }
        return stripe.customers.retrieve(customerId).then(customer => {
          const newCard = !customer.sources.data
            .map(data => data.id)
            .includes(order.token.card.id)
          const promise = newCard
            ? stripe.customers.createSource(customerId, {
                source: order.token.id
              })
            : Promise.resolve()
          return promise.then(() => {
            const time = DateTime.fromMillis(order.time)
            const hour = time.hour
            const minute = time.minute == 30 ? 0.5 : 0
            const amount = hour * price + minute * price
            const currency = 'eur'
            const description = formatDescriptionFromOrder(order)
            const source = order.token.card.id
            return stripe.charges.create({
              amount,
              currency,
              description,
              customer: customerId,
              source
            })
          })
        })
      })
      .then(() => {
        return db
          .ref(
            '/users/' +
              req.session.decodedClaims.uid +
              '/' +
              order.idOrder +
              '/order'
          )
          .update({
            status: 'executed'
          })
      })
      .then(() => {
        return db.ref('/users/' + req.session.decodedClaims.uid).once('value')
      })
      .then(snapshot => {
        const orders = []
        snapshot.forEach(function(childSnapshot) {
          const copyChild = childSnapshot.exportVal()
          if (copyChild && copyChild.order) {
            const order = copyChild.order
            orders.push(order)
          }
        })
        res.status(200).send(orders)
      })
      .catch(err => {
        console.log(err)
        if (err.code === 'resource_missing') {
          res.status(500).send('Internal error!')
          return
        }
        res.status(401).send('UNAUTHORIZED REQUEST!')
      })
  })

  router.get('/getorders', (req, res) => {
    const orders = []
    db.ref('/users/' + req.session.decodedClaims.uid)
      .once('value')
      .then(snapshot => {
        snapshot.forEach(function(childSnapshot) {
          const copyChild = childSnapshot.exportVal()
          if (copyChild && copyChild.order) {
            const order = copyChild.order
            /*if (copyChild.order.status != 'removed') {
              orders.push(copyChild.order)
            }
            const time = DateTime.fromMillis(order.time)
            const hour = time.get('hour')
            const minute = time.get('minute') == 30 ? 0.5 : 0*/
            orders.push(order)
          }
        })
        orders.sort(function(a, b) {
          if (b) {
            return b.sinceDate - a.sinceDate
          }
          return 1
        })
        res.status(200).send(orders)
      })
      .catch(err => {
        console.log(err)
        console.log('The read failed: ' + err.code)
        res.status(401).send('UNAUTHORIZED REQUEST!')
      })
  })

  router.post('/cancelorder', (req, res) => {
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
        console.log(err)
        res.status(500).send('Internal error!')
      })
  })
  return router
}
