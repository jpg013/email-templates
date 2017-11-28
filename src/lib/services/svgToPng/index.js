const winston  = require('winston')
const path     = require('path')
const fs       = require('fs')
const uuidV4   = require('uuid/v4')

async function connect(container) {
  const { fileHelpers } = container

  if (!fileHelpers) {
    throw new Error('missing required dependency')
  }

  async function convertSvgToPng(svgFileId, pngFileId, fileConverter, opts={}) {
    const destFile = fileHelpers.makeTmpFilePath(pngFileId)
    const sourceFile = fileHelpers.makeTmpFilePath(svgFileId)
    let process

    try {
      process = await fileConverter.createProcess()
      process = await fileConverter.startProcess(process, sourceFile, opts)

      // Download on completion
      await fileConverter.downloadFile(process, destFile)
    } catch(e) {
      winston.log('error', e)
    } finally {
      if (process) {
        process.delete()
      }
    }
  }

  return {
    convertSvgToPng
  }
}

module.exports = Object.create({connect})
