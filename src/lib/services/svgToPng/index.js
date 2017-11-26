const winston = require('winston')

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
    const timestamp = new Date().getTime()
    const pngFile = makeTmpFilePath(`svg_to_png_${timestamp}.png`)

    let process

    try {
      process = await fileConverterRepository.startProcess(
        await fileConverterRepository.createProcess(),
        svgFile,
        opts
      )

      await fileConverterRepository.downloadFile(process, pngFile)
    } catch(e) {
      winston.log('error', e)
    } finally {
      if (process) {
        process.delete()
      }
    }

    const base64Str = await encodeFileBase64(pngFile)

    return pngFile
  }

  async function writeSvgToFile(id, svg) {
    const timestamp = new Date().getTime()
    const file = makeTmpFilePath(`${id}_${timestamp}.svg`)

    await writeToFile(svg, file)
    return file
  }

  return {
    convertSvgToPng,
    writeSvgToFile
  }
}

module.exports = Object.create({connect})
