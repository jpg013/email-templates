'use strict'

const { EventEmitter }          = require('events')
const { promisify }             = require('util')
const server                    = require('./server/server')
const config                    = require('./config')
const mediator                  = new EventEmitter()
const winston                   = require('winston')
const fs                        = require('fs')
const sgMail                    = require('@sendgrid/mail')
const templates                 = require('./templates')
const services                  = require('./services')
const repository                = require('./repository')
const workers                   = require('./workers')

/*
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: 'justin.graber@dunami.com',
  from: 'jpg013@gmail.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: `<html>
    <body>
      <div style='height: 100px; width: 100px; background: pink'>
        <image height='100px' width='100px' src='data:image/png;base64, ${base_64}' scale='1'></image>
      </div>
    </body>
  </html>`
}
sgMail.send(msg)
}
*/

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

    container.repository = await repository.connect(container)
    winston.log('info', 'Connected to repository')

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
