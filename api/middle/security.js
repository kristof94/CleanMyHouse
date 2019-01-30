const express = require('express')
const session = require('cookie-session')
const dotenv = require('dotenv')
const helmet = require('helmet')
dotenv.config()

const router = express.Router()

// router.use(helmet())
// router.use(helmet.noCache())
router.use(helmet.xssFilter())
const sixtyDaysInSeconds = 5184000
router.use(
  helmet.hsts({
    maxAge: sixtyDaysInSeconds
  })
)
router.use(helmet.noSniff())
router.use(helmet.frameguard({ action: 'sameorigin' }))

router.use(function(err, req, res, next) {
  console.log(req)
  console.log('ici')
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
      httpOnly: true,
      sameSite: true
    }
  })
)

module.exports = router
