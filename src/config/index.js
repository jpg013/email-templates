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
const fileHelpers   = require('../bin/fileHelpers')

const bindArgs = {
  serverSettings,
  cacheSettings,
  pathSettings,
  fileHelpers,
  cache,
  fileConverterSettings,
  fileConverter,
  models
}

const init = di.initDI.bind(null, bindArgs)

module.exports = Object.create({ init })
