const fs                  = require('fs')
const path                = require('path')
const { promisify }       = require('util')
const zlib                = require('zlib')

const deflateAsync    = promisify(zlib.deflate)
const inflateAsync    = promisify(zlib.inflate)
const unlinkFileAsync = promisify(fs.unlink)

const readFileStreamAsync = (file, opts={}) => {
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

const writeFileStreamAsync = (string, file) => {
  return new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(file)

    ws.on('finish', resolve);
    ws.on('error', reject)
    ws.write(string)
    ws.end();
  });
}

function connect(pathSettings) {
  const readStaticImg = img => readFileStreamAsync(path.resolve(pathSettings.staticImagesDir, img))
  const deflateFile = file => deflateAsync(file)
  const inflateFile = file => inflateAsync(file)

  return {
    readStaticImg,
    deflateFile,
    inflateFile
  }
}

module.exports = Object.create({connect})

/*
module.exports = {
  readFileAsync,
  writeToFile,
  unlinkFileAsync,
  createWriteStream,
  createReadStream,
  readFileStreamAsync
}
*/
