const express = require('express')
const app = express()
const https = require('https')
const fs = require('fs-extra')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('cookie-session')
// const helmet = require('helmet')
// const csrf = require('csurf')
const admin = require('./services/firebase-admin-init.js')
const router = require('./api/routes/authRoute')(admin)
const orderRouter = require('./api/routes/order')(admin)
const { Nuxt, Builder } = require('nuxt')
dotenv.config()

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
// Create express instnace
// Import API Routes
var parseForm = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json()) // handle json data
app.use(cookieParser())
app.use(parseForm) // handle URL-encoded data
/*app.use(
  csrf({
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: true
    }
  })
)*/

// router.use(helmet())
// router.use(helmet.noCache())
/*
app.use(helmet.xssFilter())
const sixtyDaysInSeconds = 5184000
router.use(
  helmet.hsts({
    maxAge: sixtyDaysInSeconds
  })
)
app.use(helmet.noSniff())
app.use(helmet.frameguard({ action: 'sameorigin' }))*/

app.use(function(err, req, res, next) {
  console.log(req)
  console.log('ici')
  if (err.code !== 'EBADCSRFTOKEN') {
    return next(err)
  }
  res.status(403)
  res.send(err)
})

app.get('/api/getcsrftoken', function(req, res) {
  return res.json({ csrfToken: 'req.csrfToken()' })
})

app.use(
  session({
    secret: process.env.secretession,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: true
    }
  })
)

app.use(router)
app.use('/order', orderRouter)
app.set('port', port)

let server
// Import and Set Nuxt.js options
let config = require('./nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')
const nuxt = new Nuxt(config)

app.post('/hello', function(req, res) {
  res.send('Hello World!')
})

async function start() {
  // Init Nuxt.js

  // Build only in dev mode
  if (config.dev) {
    console.log('dev mode')
    const builder = new Builder(nuxt)
    await builder.build()
    const httpsOptions = {
      key: fs.readFileSync('./key.pem'),
      cert: fs.readFileSync('./cert.pem'),
      passphrase: process.env.certpassword
    }
    app.use(nuxt.render)
    server = https.createServer(httpsOptions, app)
    server.listen(port, host)
    const message = `Server listening on https://${host}:${port}`
    console.log(message)
  } else {
    app.use(nuxt.render)
    // Listen the server
    const message = `Server listening`
    console.log(message)
    app.listen(port)
  }
}
start()
