const fs                  = require('fs')
const path                = require('path')
const { promisify }       = require('util')
const zlib                = require('zlib')
const uuidV4              = require('uuid/v4')

const deflateAsync    = promisify(zlib.deflate)
const inflateAsync    = promisify(zlib.inflate)
const unlinkFileAsync = promisify(fs.unlink)
const fileStatAsync   = promisify(fs.stat)

const readFileStreamAsync = (file, opts={}) => {
  return new Promise((resolve, reject) => {
    try {
      const readStream = fs.createReadStream(file, opts) // Buffer Stream
      let bitmap = Buffer.from('')

      readStream.on('data', chunk => bitmap = Buffer.concat([bitmap, chunk]))
      readStream.on('end', () => resolve(bitmap))
      readStream.on('error', reject)
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
  const readDirAsync           = promisify(fs.readdir)
  const readStaticFile         = fileId => readFileStreamAsync(path.resolve(pathSettings.staticFileDir, fileId))
  const readTmpFile            = fileId => readFileStreamAsync(path.resolve(pathSettings.tmpFileDir, fileId))
  const readTmpDir             = () => readDirAsync(path.resolve(pathSettings.tmpFileDir))
  const deleteTmpFile          = fileId => unlinkFileAsync(path.resolve(pathSettings.tmpFileDir, fileId))
  const deflateFile            = file => deflateAsync(file)
  const inflateFile            = file => inflateAsync(file)
  const makeTmpFilePath        = f => path.resolve(pathSettings.tmpFileDir, f)
  const generateUniqueFileName = id => `${id}_${uuidV4()}`
  const loadDirFiles           = dir => readDirAsync(dir).then(f => f.map(cur => require(path.resolve(dir, cur))))
  const getTmpFileStats        = () => {
    return readTmpDir()
      .then(dir => {
        return Promise.all(dir.map(async fileId => {
          const fileStat = await fileStatAsync(makeTmpFilePath(fileId))

          return Object.assign({}, {
            createdTime: fileStat.birthtime.getTime(),
            fileId
          })
        }))
      })
  }

  return {
    readStaticFile,
    readTmpFile,
    deleteTmpFile,
    deflateFile,
    inflateFile,
    writeFileStreamAsync,
    makeTmpFilePath,
    generateUniqueFileName,
    readTmpDir,
    loadDirFiles,
    getTmpFileStats
  }
}

module.exports = Object.create({connect})
