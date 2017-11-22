function convertSvgToPng(fileConverterRepository, encodeFileBase64, makeTmpFilePath) {

  return async (svgFile, opts={}) => {
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
      console.log(e)
    } finally {
      if (process) {
        process.delete()
      }
    }

    const base64Str = await encodeFileBase64(pngFile)

    return {
      file: pngFile,
      base64Str
    }
  }
}

module.exports = convertSvgToPng
