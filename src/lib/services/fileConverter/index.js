const fs = require('fs')

async function connect(container) {
  const { fileConverter } = container

  if (!fileConverter) {
    throw new Error('missing required dependencies')
  }

  async function createProcess() {
    return new Promise((resolve, reject) => {
      const opts = {
        inputformat: 'html',
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

  function waitForProcessToFinish(process) {
    return new Promise((resolve, reject) => {
      process.refresh()
      process.wait((err, updatedProcess) => {
        if (err) {
          process.delete();
          return reject(err)
        }
        resolve(updatedProcess)
      })
    })
  }

  async function startProcess(process, file, opts={}) {
    return new Promise((resolve, reject) => {
      function callback(err, process) {
        if (err) {
          process.delete()
          return reject(err)
        }

        waitForProcessToFinish(process).then(resolve)
      }

      const converteroptions = (opts.width && opts.height) ? { resize: `${opts.width}x${opts.height}` } : {}

      const args = {
        wait: true,
        input: 'upload',
        outputformat: 'png',
        converteroptions
      }

      process.start(args, callback)
      // Upload the file to start the process
      process.upload(fs.createReadStream(file, { encoding: undefined }))
    })
  }

  async function downloadFile(process, file) {
    return new Promise((resolve, reject) => {
      const ws = process.pipe(fs.createWriteStream(file, { encoding: undefined }))

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
