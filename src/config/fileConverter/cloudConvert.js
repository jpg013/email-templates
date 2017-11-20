const cloudconvert = require('cloudconvert')

function connect(options, mediator) {
  return new cloudconvert(options.api_key)
}

 module.exports = Object.create({ connect })
