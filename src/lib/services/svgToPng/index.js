const winston  = require('winston')
const path     = require('path')
const fs       = require('fs')
const uuidV4   = require('uuid/v4')
const phantom  = require('phantom')

async function connect(container) {
  const { fileHelpers } = container

  if (!fileHelpers) {
    throw new Error('missing required dependency')
  }

  async function convertSvgToPng(svgFileId, pngFileId, opts={}) {
    const destFile = fileHelpers.makeTmpFilePath(pngFileId)
    const sourceFile = fileHelpers.makeTmpFilePath(svgFileId)

    const instance = await phantom.create()
    const page = await instance.createPage()

    // await page.property('viewportSize', { width: 1233, height: 664 });

    const status = await page.open(sourceFile);
    await page.render(destFile)

    await instance.exit()
  }

  return {
    convertSvgToPng
  }
}

module.exports = Object.create({connect})
