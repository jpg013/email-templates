const {
  serverSettings,
  cacheSettings,
  pathSettings,
  fileConverterSettings
}                   = require('./config')
const di            = require('./di')
const cache         = require('./cache')
const fileConverter = require('./fileConverter')
const models        = require('../lib/models')

const bindArgs = {
  serverSettings,
  cacheSettings,
  pathSettings,
  cache,
  fileConverterSettings,
  fileConverter,
  models
}

const init = di.initDI.bind(null, bindArgs)

module.exports = Object.create({ init })
