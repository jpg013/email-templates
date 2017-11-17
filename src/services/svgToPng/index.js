const phantom       = require('phantom')
const path          = require('path')
const fs            = require('fs')
const { promisify } = require('util')
const uuidv4        = require('uuid/v4');

const readFileAsync   = promisify(fs.readFile)
const unlinkFileAsync = promisify(fs.unlink)

const tmpFileDirPath = path.resolve(__dirname, 'tmp_files')

const writeToFile = (string, filePath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath)
    file.on("finish", resolve);
    file.on("error", reject)

    file.write(string)
    file.end();
  });
}

async function encode_file_base64(file) {
  const bitmap = await readFileAsync(file)

  return new Buffer(bitmap).toString('base64')
}

async function connect(container) {
  const { workers, pathSettings } = container

  if (!workers || !pathSettings) {
    throw new Error('missing required dependencies')
  }

  const makeFilePath = fileName => path.resolve(pathSettings.tmpFileDir, fileName)

  async function renderFile(sourceFile, destFile, opts) {
    const instance = await phantom.create()
    const page = await instance.createPage()
    const viewportSize = {
      width: opts.width || 100,
      height: opts.height || 100
    }

    await page.property('viewportSize', viewportSize)

    const status = await page.open(sourceFile)
    const content = await page.property('body')
    await page.render(destFile)
  }

  async function saveAsPng(fileName, svgMarkup, opts={}) {
    if (!fileName || !svgMarkup) {
      throw new Error('error saving svg to png')
    }

    const timestamp = new Date().getTime()
    const pngFileName = `${fileName}_${timestamp}.png`
    const svgFileName = `${fileName}_${timestamp}.html`
    const svgFilePath = makeFilePath(svgFileName)
    const pngFilePath = makeFilePath(pngFileName)

    await writeToFile(svgMarkup, svgFilePath)
    await renderFile(svgFilePath, pngFilePath, opts)

    return pngFilePath
  }

  async function svgToPngBase64Encoded(svgMarkup, opts={}) {
    const timestamp = new Date().getTime()

    //const uuid = uuidv4() // 'df7cca36-3d7a-40f4-8f06-ae03cc22f045'
    const sourceFile = makeTmpSvgFilePath(uuid)
    const destFile = makeTmpPngFilePath(uuid)

    await writeSvgtoTmpFile(svgMarkup, sourceFile)

    // await instantiatePageAndRenderToDestination(sourceFile, destFile, opts)

    const base64EncodedString = await base64_encode(await readFileAsync(destFile))

    workers.scheduleDirCleanupJob(tmpFileDirPath, 10)

    return base64EncodedString
  }

  return {
    saveAsPng,
    encode_file_base64
  }
}

 module.exports = Object.create({connect})
