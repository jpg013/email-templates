const path            = require('path')
const convertSvgToPng = require('./convertSvgToPng')
const d3              = require('d3')
const jsdom           = require('jsdom')
const buildDonutChart = require('./buildDonutChart')

async function connect(container) {
  const { file, pathSettings, repositories } = container

  if (!file || !pathSettings || !repositories) {
    throw new Error('missing required dependencies')
  }

  const { fileConverterRepository } = repositories
  const { encodeFileBase64 } = file

  if (!fileConverterRepository || !encodeFileBase64) {
    throw new Error('missing required dependencies')
  }

  const makeTmpFilePath = fileName => path.resolve(pathSettings.tmpFileDir, fileName)

  return {
    convertSvgToPng: convertSvgToPng(fileConverterRepository, encodeFileBase64, makeTmpFilePath),
    buildDonutChart: buildDonutChart(jsdom, d3)
  }
}

 module.exports = Object.create({connect})
