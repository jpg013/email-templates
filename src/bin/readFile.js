const fs = require('fs')

function readFile(file, opts={ encoding: undefined }) {
  return new Promise((resolve, reject) => {
    try {
      const rs = fs.createReadStream(file, {encoding: undefined}) // Buffer Stream
      let bitmap = new Buffer('')

      readStream.on('data', chunk => bitmap = Buffer.concat([bitmap, chunk]))
      readStream.on('end', () => resolve(bitmap))
      readStream.on('error', err => throw new Error(err))
    } catch(e) {
      reject(e)
    }
  })
}

module.exports = readFile
