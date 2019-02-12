const dotenv = require('dotenv')
dotenv.config()

var exec = require('child_process').exec
exec(process.env.npm_run, function(err, stdout) {
  if (err) throw err
  else console.log(stdout)
})
