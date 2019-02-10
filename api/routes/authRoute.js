const express = require('express')
const { clearCookie } = require('../utils/authUtil')
var router = express.Router()
const expiresIn = 60 * 1000 * 20 // 10 min
module.exports = function(admin) {
  const { checkCookieSession } = require('../middle/authmiddleware')(admin)
  const checkSession = (req, res, next) => {
    const sessionCookie = req.session.sessionCookie || null
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
      res.status(400).send('BAD REQUEST!')
    }
  }

  router.get('/', (req, res, next) => {
    const sessionCookie = req.session.sessionCookie || ''
    if (sessionCookie) {
      checkCookieSession(req, sessionCookie)
        .catch(() => {
          clearCookie(res)
        })
        .finally(() => {
          next()
        })
    } else {
      next()
    }
  })

  router.post('/sessionToken', (req, res) => {
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
        clearCookie(res)
        res.status(401).send('UNAUTHORIZED REQUEST!')
      })
  })

  router.post('/sessionLogout', (req, res) => {
    req.session.destroy()
    clearCookie(res)
    res.status(200).send('loggout!')
  })

  router.post('/profile', checkSession, (req, res) => {
    // Verify the session cookie. In this case an additional check is added to detect
    // if the user's Firebase session was revoked, user deleted/disabled, etc.
    res.status(200).send('ok')
  })

  router.post('/updatePhoneNumber', checkSession, (req, res) => {
    const phone = req.body.form.phone
    if (!phone) {
      res.status(400).send('BAD REQUEST!')
      return
    }
    admin
      .auth()
      .updateUser(req.session.decodedClaims.uid, {
        phoneNumber: phone
      })
      .then(function() {
        res.status(200).send('ok')
      })
      .catch(function(error) {
        console.log(error)
        res.status(400).send('BAD REQUEST!')
      })
  })

  router.get('/verifySession', checkSession, (req, res) => {
    res.status(200).send({ verifySession: 'true' })
  })

  return router
}
