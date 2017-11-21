function convertSvgToPng(fileConverterRepository, encodeFileBase64, makeTmpFilePath) {
  return async function convertSvgToPng(file, opts={}) {
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
}

module.exports = convertSvgToPng
