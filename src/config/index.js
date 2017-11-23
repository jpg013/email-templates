const {
  serverSettings,
  cacheSettings,
  pathSettings,
  fileConverterSettings
}                   = require('./config')
const di            = require('./di')
const cache         = require('./cache')
const fileConverter = require('./fileConverter')
const file          = require('../libs/file')

const bindArgs = {
  serverSettings,
  cacheSettings,
  pathSettings,
  cache,
  fileConverterSettings,
  fileConverter,
  file
}

const init = di.initDI.bind(null, bindArgs)

module.exports = Object.create({ init })
