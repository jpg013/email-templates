function initDI ({serverSettings, cacheSettings, cache}, mediator) {

  mediator.once('init', () => {
    mediator.on('cache.ready', cache => {
      // POJO container for DI
      const container = Object.create({})

      container.serverSettings = Object.assign({}, serverSettings)
      container.cache = cache

      mediator.emit('di.ready', container)
    })

    mediator.on('cache.error', err => mediator.emit('di.error', err))

    cache.connect(cacheSettings, mediator)

    mediator.emit('boot.ready')

  })
}

module.exports.initDI = initDI
