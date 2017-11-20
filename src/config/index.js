const {
  serverSettings,
  cacheSettings,
  pathSettings,
  cdnSettings,
  fileConverterSettings
}                   = require('./config')
const di            = require('./di')
const cache         = require('./cache')
const cdn           = require('./cdn')
const fileConverter = require('./fileConverter')

const bindArgs = {
  serverSettings,
  cacheSettings,
  pathSettings,
  cache,
  cdnSettings,
  cdn,
  fileConverterSettings,
  fileConverter
}

const init = di.initDI.bind(null, bindArgs)

module.exports = Object.create({ init })
