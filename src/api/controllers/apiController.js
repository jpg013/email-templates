const express    = require('express')
const httpStatus = require('http-status-codes')
//const sgMail     = require('@sendgrid/mail')
const dial       = require('../../libs/dial')

const APIController = container => {
  const { services } = container

  if (!services) {
    throw new Error('missing required services dependency')
  }

  const { templateEngine } = services

  const controller = express.Router()

  // ======================================================
  // Response Error Messages
  // ======================================================
  const getErrorResponse = error => {
    switch(error) {
      case 'Bad request data.':
        return {
          status: 400,
          error
        }
      default:
        return {
          status: 500,
          error
        }
    }
  }

  const responseHandler = (req, res) => {
    if (req.error) {
      const {status, error} = getErrorResponse(req.error)
      res.status(status).send({error})
    } else {
      const {results} = req
      res.status(httpStatus.OK).send(results)
    }
  }

  function sendEmailTemplate({html, attachments}) {
    const body = {
      'personalizations': [
        {
          to: [{email: 'justin.graber@dunami.com'}],
          subject: 'Hello, World!'
        }
      ],
      from: {
        email: 'dev@innosolpro.com'
      },
      content: [
        {
          type: 'text/html',
          value: html
        }
      ],
      // attachments
    }

    const headers = {
      Authorization: `Bearer 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`
    }

    const opts = {
      headers,
      json: body
    }

    dial('https://api.sendgrid.com/v3/mail/send', 'post', opts)
  }

  // ======================================================
  // Controller Methods
  // ======================================================
  async function postVolumeChangeTemplate(req, res, next) {
    try {
      const results = await templateEngine.renderVolumeChangeTemplate()
      req.results = results.html

      // This is complete test code, remove once finished
      sendEmailTemplate(results)
    } catch(e) {
      req.error = e
    } finally {
      next()
    }
  }

  // ======================================================
  // Controller Routes
  // ======================================================
  controller.get('/volume-change', postVolumeChangeTemplate, responseHandler)

  return controller
}

module.exports = APIController
