const fs                  = require('fs')
const path                = require('path')
const { promisify }       = require('util')

const readDirAsync  = promisify(fs.readdir)
const readFileAsync = promisify(fs.readFile)
const unlinkFileAsync = promisify(fs.unlink)

async function encodeFileBase64(bitmap) {
  return new Buffer(bitmap).toString('base64')
}

const writeToFile = (string, file) => {
  return new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(file)

    ws.on('finish', resolve);
    ws.on('error', reject)
    ws.write(string)
    ws.end();
  });
}

const createWriteStream = filePath => fs.createWriteStream(filePath)
const createReadStream = filePath => fs.createReadStream(filePath, 'utf8')

const readFileStreamAsync = file => {
  console.log(file)
  return new Promise((resolve, reject) => {
    let data = '';
    let readStream = createReadStream(file)

    readStream.on('data', chunk => data += chunk)
    readStream.on('end', () => resolve(data))
    readStream.on('error', err => reject(err))
  })
}


module.exports = {
  readDirAsync,
  readFileAsync,
  encodeFileBase64,
  writeToFile,
  unlinkFileAsync,
  createWriteStream,
  createReadStream,
  readFileStreamAsync
}
