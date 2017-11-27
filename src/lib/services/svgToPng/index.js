const winston  = require('winston')
const path     = require('path')
const fs       = require('fs')
const uuidV4   = require('uuid/v4')

async function connect(container) {
  const { pathSettings } = container

  if (!pathSettings) {
    return new Error('missing required dependency')
  }

  const makeTmpFilePath = f => path.resolve(pathSettings.tmpFileDir, f)

  const writeToFile = (string, file) => {
    return new Promise((resolve, reject) => {
      const ws = fs.createWriteStream(file)

      ws.on('finish', resolve);
      ws.on('error', reject)
      ws.write(string)
      ws.end();
    });
  }

  async function convertSvgToPng(fileConverter, svgFile, opts={}) {
    const uuid = uuidV4()
    const pngFile = makeTmpFilePath(`${uuid}.png`)

    let process

    try {
      process = await fileConverter.startProcess(
        await fileConverter.createProcess(),
        svgFile,
        opts
      )

      await fileConverter.downloadFile(process, pngFile)
    } catch(e) {
      winston.log('error', e)
    } finally {
      if (process) {
        process.delete()
      }
    }

    return pngFile
  }

  async function writeSvgToFile(svg) {
    const uuid = uuidV4()
    const file = makeTmpFilePath(`${uuid}.svg`)

    await writeToFile(svg, file)
    return file
  }

  return {
    convertSvgToPng,
    writeSvgToFile
  }
}

module.exports = Object.create({connect})
