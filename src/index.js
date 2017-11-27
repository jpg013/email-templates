'use strict'

const { EventEmitter }          = require('events')
const server                    = require('./server/server')
const config                    = require('./config')
const mediator                  = new EventEmitter()
const winston                   = require('winston')
const fs                        = require('fs')
const services                  = require('./lib/services')
const repository                = require('./lib/repository')
const readFile                  = require('./bin/readFile')
const cacheStaticImages         = require('./bin/cacheStaticImages')

winston.log('info', '--- Email Templates Service---')

process.on('uncaughtException', (err) => {
  winston.log('error', 'Unhandled Exception', err)
})

process.on('uncaughtRejection', (err, promise) => {
  winston.log('error', 'Unhandled Rejection', err)
})

async function onDIReady(container) {
  try {
    container.repository = await repository.connect(container)
    winston.log('info', 'Connected to repository')

    container.services = await services.connect(container)
    winston.log('info', 'Connected to services')

    // Preload the template images into cache
    cacheStaticImages(container.pathSettings.staticImagesDir, readFile, container.repository.set)

    // Start the server
    const app = await server.start(container)

    winston.log('info', `Server started succesfully, running on port: ${container.serverSettings.port}.`)

    app.on('close', () => winston.log('info', 'closing app'))
  } catch(e) {
    winston.log('error', e)
  }
}

mediator.on('di.ready', onDIReady)

config.init(mediator)

mediator.emit('init')
