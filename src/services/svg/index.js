const path            = require('path')
const convertSvgToPng = require('./convertSvgToPng')
const d3              = require('d3')
const jsdom           = require('jsdom')
const buildDonutChart = require('./buildDonutChart')

const { JSDOM } = jsdom;

async function connect(container) {
  const { file, pathSettings, repositories } = container

  if (!file || !pathSettings || !repositories) {
    throw new Error('missing required dependencies')
  }

  const { fileConverterRepository } = repositories
  const { encodeFileBase64, writeToFile } = file

  if (!fileConverterRepository || !encodeFileBase64 || !writeToFile) {
    throw new Error('missing required dependencies')
  }

  const makeTmpFilePath = fileName => path.resolve(pathSettings.tmpFileDir, fileName)

  async function writeFileToSvg(tplFile={}) {
    switch(tplFile.type) {
      case 'donut_chart_svg':
        const timestamp = new Date().getTime()
        const dom = new JSDOM(tplFile.markup, { runScripts: "dangerously" })
        const filepath = makeTmpFilePath(`${tplFile.id}_${timestamp}.svg`)
        const htmlStr = buildDonutChart(dom, d3, tplFile.data)

        await writeToFile(htmlStr, filepath)
        return filepath
      default:
        return tplFile.markup
    }
  }

  return {
    convertSvgToPng: convertSvgToPng(fileConverterRepository, encodeFileBase64, makeTmpFilePath),
    writeFileToSvg
  }
}

 module.exports = Object.create({connect})
