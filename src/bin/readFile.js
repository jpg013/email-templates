const fs = require('fs')

function readFile(file, opts={}) {
  return new Promise((resolve, reject) => {
    try {
      const readStream = fs.createReadStream(file, opts) // Buffer Stream
      let bitmap = Buffer.from('')

      readStream.on('data', chunk => bitmap = Buffer.concat([bitmap, chunk]))
      readStream.on('end', () => resolve(bitmap))
      readStream.on('error', err => {
        throw new Error(err)
      })
    } catch(e) {
      reject(e)
    }
  })
}

module.exports = readFile
