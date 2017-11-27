const fs                  = require('fs')
const path                = require('path')
const { promisify }       = require('util')
const zlib                = require('zlib')

const deflateAsync    = promisify(zlib.deflate)
const unlinkFileAsync = promisify(fs.unlink)

const readFileStreamAsync = file => {
  return new Promise((resolve, reject) => {
    let data = Buffer.from('')
    let readStream = fs.createReadStream(file, {encoding: undefined})

    readStream.on('data', chunk => {
      data = Buffer.concat([data, chunk]);
    })
    readStream.on('end', () => resolve(data))
    readStream.on('error', err => reject(err))
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

  return {
    readStaticImg,
    deflateFile
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
