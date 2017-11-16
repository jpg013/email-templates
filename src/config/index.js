const {
  serverSettings,
  cacheSettings
}                 = require('./config')
const di          = require('./di')
const cache       = require('./cache')

const bindArgs = { serverSettings, cacheSettings, cache }
const init = di.initDI.bind(null, bindArgs)

module.exports = Object.create({ init })
