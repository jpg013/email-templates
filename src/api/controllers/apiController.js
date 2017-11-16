const express    = require('express')
const httpStatus = require('http-status-codes')

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

  // ======================================================
  // Controller Methods
  // ======================================================
  async function postVolumeChangeTemplate(req, res, next) {
    try {
      req.results = await templateEngine.renderVolumeChangeTemplate()
    } catch(e) {
      console.log(e)
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
