const path = require('path')
const fs   = require('fs')
const { promisify } = require('util')
const readFileAsync   = promisify(fs.readFile)

async function connect(container) {
  const { fileConverter, pathSettings } = container

  if (!fileConverter) {
    throw new Error('missing required file dependency')
  }

  async function createProcess() {
    return new Promise((resolve, reject) => {
      const opts = {
        inputformat: 'svg',
        outputformat: 'png'
      }

      fileConverter.createProcess(opts, (err, process) => {
        if (err) {
          return reject(err)
        }
        resolve(process)
      })
    })
  }

  async function startProcess(process, filename, filepath, opts={}) {
    return new Promise((resolve, reject) => {
      const callback = (err, process) => {
        if (err) {
          return reject(err)
        }

        resolve(process)
      }

      const args = {
        wait: true,
        input: 'upload',
        file: '',
        filename,
        outputformat: 'png',
        converteroptions: {
          resize: `${opts.width}x${opts.height}`
        }
      }

      process.start(args, callback)

      // Upload the file to start the process
      process.upload(fs.createReadStream(path.resolve(filepath, filename)))
    })
  }

  async function downloadFile(process, path) {
    return new Promise((resolve, reject) => {
      const ws = process.pipe(fs.createWriteStream(path))

      ws.on('finish', resolve)
      ws.on('error', reject)
    })
  }

  return {
    createProcess,
    startProcess,
    downloadFile
  }
}

 module.exports = Object.create({connect})
