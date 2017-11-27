const express       = require('express')
const httpStatus    = require('http-status-codes')
const { promisify } = require('util')
const zlib          = require('zlib')

const inflateAsync  = promisify(zlib.inflate)

const connect = container => {
  const { repository } = container

  const controller = express.Router()

  async function getTemplateFile(req, res, next) {
    const { file_id: fileId } = req.params
    const zippedValue = await repository.get(fileId)

    if (!zippedValue) {
      return res.status(httpStatus.NOT_FOUND).send()
    }

    const file = await inflateAsync(Buffer.from(zippedValue, 'base64'))

    res.setHeader('Content-Type', 'image/png')
    res.end(file); //send the value and end the connection
  }

  // ======================================================
  // Controller Routes
  // ======================================================
  controller.get('/:file_id', getTemplateFile)

  return controller
}

module.exports = Object.assign({ connect })
