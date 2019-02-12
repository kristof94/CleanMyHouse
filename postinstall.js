const dotenv = require('dotenv')
dotenv.config()

console.log('run ', process.env.secretession)
console.log('run ', process.env.npm_run)
var exec = require('child_process').exec
exec(process.env.npm_run, function(err, stdout) {
  if (err) throw err
  else console.log(stdout)
})
