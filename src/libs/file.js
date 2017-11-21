const fs                  = require('fs')
const { promisify }       = require('util')

const readDirAsync  = promisify(fs.readdir)
const readFileAsync = promisify(fs.readFile)
const unlinkFileAsync = promisify(fs.unlink)

async function encodeFileBase64(file) {
  const bitmap = await readFileAsync(file)

  return new Buffer(bitmap).toString('base64')
}

const writeToFile = (string, filePath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath)
    file.on("finish", resolve);
    file.on("error", reject)

    file.write(string)
    file.end();
  });
}

module.exports = {
  readDirAsync,
  readFileAsync,
  encodeFileBase64,
  writeToFile,
  unlinkFileAsync
}
