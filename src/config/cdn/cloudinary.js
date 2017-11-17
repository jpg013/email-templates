const cloudinary = require('cloudinary');

function connect(options, mediator) {
  cloudinary.config(options)

  return cloudinary
}

 module.exports = Object.create({ connect })
