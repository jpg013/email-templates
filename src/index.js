'use strict'

const { EventEmitter }          = require('events')
const { promisify }             = require('util')
const server                    = require('./server/server')
const config                    = require('./config')
const mediator                  = new EventEmitter()
const winston                   = require('winston')
const fs                        = require('fs')
const templates                 = require('./templates')
const services                  = require('./services')
const repositories              = require('./repositories')
const workers                   = require('./workers')

winston.log('info', '--- Email Templates Service---')

process.on('uncaughtException', (err) => {
  winston.log('error', 'Unhandled Exception', err)
})

process.on('uncaughtRejection', (err, promise) => {
  winston.log('error', 'Unhandled Rejection', err)
})

async function onDIReady(container) {
  try {
    container.workers = await workers.connect(container)
    winston.log('info', 'Connected to workers')

    container.repositories = await repositories.connect(container)
    winston.log('info', 'Connected to repositories')

    container.templates = await templates.connect(container)
    winston.log('info', 'Connected to views')

    container.services = await services.connect(container)
    winston.log('info', 'Connected to services')

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
