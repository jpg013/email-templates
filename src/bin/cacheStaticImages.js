const fs                  = require('fs')
const path                = require('path')
const { promisify }       = require('util')
const zlib                = require('zlib')

const deflateAsync  = promisify(zlib.deflate)
const readDirAsync  = promisify(fs.readdir)

async function cacheStaticImages(imgDir, readFile, cacheSet) {
  const dir = await readDirAsync(imgDir)

  return Promise.all(dir.map(async i => {
    const imgBuffer = await readFile(path.resolve(imgDir, i))

    const zippedImage = await deflateAsync(imgBuffer)

    cacheSet(i, zippedImage.toString('base64'))
  }))
}

module.exports = cacheStaticImages
