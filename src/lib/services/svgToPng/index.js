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

  async function convertSvgToPng(fileId, svgFile, fileConverter, opts={}) {
    const cid = `${fileId}_${uuidV4()}`
    const file = makeTmpFilePath(`${cid}.png`)

    let process

    try {
      process = await fileConverter.startProcess(
        await fileConverter.createProcess(),
        svgFile,
        opts
      )

      await fileConverter.downloadFile(process, file)
    } catch(e) {
      winston.log('error', e)
    } finally {
      if (process) {
        process.delete()
      }
    }

    return { file, cid }
  }

  async function writeSvgToFile(fileId, compiledSvgChart) {
    const file = makeTmpFilePath(`${fileId}_${uuidV4()}.svg`)

    await writeToFile(svg, file)
    return file
  }

  return {
    convertSvgToPng,
    writeSvgToFile
  }
}

module.exports = Object.create({connect})
