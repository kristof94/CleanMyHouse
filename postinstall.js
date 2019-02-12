const dotenv = require('dotenv')
var exec = require('child_process').exec

dotenv.config()

console.log('run ', process.env.secretession)
console.log('run ', process.env.hoclick)
exec(process.env.hoclick, function(err, stdout) {
  if (err) throw err
  else console.log(stdout)
})
