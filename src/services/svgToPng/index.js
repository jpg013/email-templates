const phantom       = require('phantom')
const path          = require('path')
const fs            = require('fs')
const { promisify } = require('util')

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

async function encodeFileBase64(file) {
  const bitmap = await readFileAsync(file)

  return new Buffer(bitmap).toString('base64')
}

async function connect(container) {
  const { workers, pathSettings, repositories } = container

  if (!workers || !pathSettings || !repositories) {
    throw new Error('missing required dependencies')
  }

  const { fileConverterRepository } = repositories

  if (!fileConverterRepository) {
    throw new Error('missing required file converter dependency')
  }

  const makeTmpFilePath = fileName => path.resolve(pathSettings.tmpFileDir, fileName)

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
    const svgFilePath = makeTmpFilePath(svgFileName)
    const pngFilePath = makeTmpFilePath(pngFileName)

    await writeToFile(svgMarkup, svgFilePath)
    await renderFile(svgFilePath, pngFilePath, opts)

    return pngFilePath
  }

  async function convert(file, opts={}) {
    const timestamp = new Date().getTime()
    const pngFileName = makeTmpFilePath(`${file}_${timestamp}.png`)
    const svgFileName = (`${file}.svg`)

    try {
      const process = await fileConverterRepository.startProcess(
        await fileConverterRepository.createProcess(),
        svgFileName,
        pathSettings.tplStaticDir,
        opts
      )

      await fileConverterRepository.downloadFile(process, pngFileName)
    } catch(e) {
      console.log(e)
    }

    const base64Str = await encodeFileBase64(pngFileName)

    return {
      file: pngFileName,
      base64Str
    }
  }

  return {
    convert
  }
}

 module.exports = Object.create({connect})
