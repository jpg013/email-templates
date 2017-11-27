function initDI ({
  serverSettings,
  pathSettings,
  redisSettings,
  cache,
  cloudConvertSettings,
  fileConverter,
  fileHelpers,
  awsSettings,
  models,
  cdn
}, mediator) {

  mediator.once('init', () => {
    mediator.on('cache.ready', cache => {
      // POJO container for DI
      const container = {}

      container.serverSettings = Object.assign({}, serverSettings)
      container.pathSettings   = Object.assign({}, pathSettings)
      container.cache          = cache
      container.fileConverter  = fileConverter.connect(cloudConvertSettings)
      container.models         = Object.assign({}, models)
      container.fileHelpers    = fileHelpers.connect(pathSettings)
      container.cdn            = cdn.connect(awsSettings)

      mediator.emit('di.ready', container)
    })

    mediator.on('cache.error', err => mediator.emit('di.error', err))

    cache.connect(redisSettings, mediator)

    mediator.emit('boot.ready')

  })
}

module.exports.initDI = initDI
