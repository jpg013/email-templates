const cloudconvert = require('cloudconvert')

function connect(options) {
  return new cloudconvert(options.api_key)
}

 module.exports = Object.create({ connect })
