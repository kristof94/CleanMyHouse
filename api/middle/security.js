const express = require('express')
const session = require('cookie-session')
const dotenv = require('dotenv')
const helmet = require('helmet')
dotenv.config()

const router = express.Router()

// router.use(helmet())
// router.use(helmet.noCache())

router.use(function(err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next(err)
  }
  res.status(403)
  res.send(err)
})

router.get('/api/getcsrftoken', function(req, res) {
  return res.json({ csrfToken: req.csrfToken() })
})

router.use(
  session({
    secret: process.env.secretession,
    cookie: {
      secure: true,
      httpOnly: true
    }
  })
)

module.exports = router
