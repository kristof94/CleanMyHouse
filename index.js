const express = require('express')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const https = require('https')
const fs = require('fs-extra')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const csrf = require('csurf')
const securityMiddleWare = require('./api/middle/security')
const authRoute = require('./api/routes/authRoute')
dotenv.config()

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

// Create express instnace
// Import API Routes
var parseForm = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json()) // handle json data
app.use(cookieParser())
app.use(parseForm) // handle URL-encoded data
app.use(
  csrf({
    cookie: {
      httpOnly: true,
      secure: true
    }
  })
)
app.use(securityMiddleWare)
app.use(authRoute)
app.set('port', port)

let server
// Import and Set Nuxt.js options
let config = require('./nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')
const nuxt = new Nuxt(config)

app.get('/hello', function(req, res) {
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
      passphrase: 'direct11'
    }
    app.use(nuxt.render)
    server = https.createServer(httpsOptions, app)
    server.listen(port, host)
    message = `Server listening on https://${host}:${port}`
  } else {
    app.use(nuxt.render)
    // Listen the server
    message = `Server listening`
    app.listen(port)
  }
}
start()
