const express       = require('express')
const httpStatus    = require('http-status-codes')
const path          = require('path')

const connect = container => {
  const { pathSettings } = container

  if (!pathSettings) {
    throw new Error('missing required dependency')
  }

  const controller = express.Router()

  async function getApiReference(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(pathSettings.staticFileDir, 'api_reference.html'));
  }

  // ======================================================
  // Controller Routes
  // ======================================================
  controller.get('/', getApiReference)

  return controller
}

module.exports = Object.assign({ connect })
