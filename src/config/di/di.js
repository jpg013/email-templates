function initDI ({
  serverSettings,
  pathSettings,
  cloudConvertSettings,
  fileHelpers,
  awsSettings,
  models,
  cdn
}, mediator) {

  mediator.once('init', () => {
    // POJO container for DI
    const container = {}

    container.serverSettings = Object.assign({}, serverSettings)
    container.pathSettings   = Object.assign({}, pathSettings)
    container.models         = Object.assign({}, models)
    container.fileHelpers    = fileHelpers.connect(pathSettings)
    container.cdn            = cdn.connect(awsSettings)

    mediator.emit('di.ready', container)
  })
}

module.exports.initDI = initDI
