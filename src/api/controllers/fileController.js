const express       = require('express')
const httpStatus    = require('http-status-codes')

const connect = container => {
  const { repository, fileHelpers } = container

  if (!repository || !fileHelpers) {
    throw new Error('missing required dependency')
  }

  const controller = express.Router()

  async function getFile(req, res, next) {
    const { fileId } = req.params

    const zippedValue = await repository.get(fileId)
    
    if (!zippedValue) {
      return res.status(httpStatus.NOT_FOUND).send()
    }

    try {
      const file = await fileHelpers.inflateFile(Buffer.from(zippedValue, 'base64'))

      res.setHeader('Content-Type', 'image/png')
      res.end(file)
    } catch(e) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({message: 'There was an error retrieving the file.'})
    }
  }

  // ======================================================
  // Controller Routes
  // ======================================================
  controller.get('/:fileId', getFile)

  return controller
}

module.exports = Object.assign({ connect })
