const express       = require('express')
const httpStatus    = require('http-status-codes')

const connect = container => {
  const { fileHelpers } = container

  if (!fileHelpers) {
    throw new Error('missing required dependency')
  }

  const controller = express.Router()

  async function getFile(req, res, next) {
    const { fileId } = req.params

    try {
      const fileBitmap = await fileHelpers.readTmpFile(fileId)

      res.setHeader('Content-Type', 'image/png')
      res.end(fileBitmap)
    } catch(e) {
      return res.status(httpStatus.BAD_REQUEST).send({message: 'Attachment does not exist.'})
    }
  }

  // ======================================================
  // Controller Routes
  // ======================================================
  controller.get('/:fileId', getFile)

  return controller
}

module.exports = Object.assign({ connect })
