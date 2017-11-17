const ejs = require('ejs')

const volumeChangeTemplateDefinition = ['volumeChangeHeader']

async function connect(container) {
  const { templates, repositories } = container

  if (!templates) {
    throw new Error('missing required views dependency')
  }

  if (!repositories) {
    throw new Error('missing required repositories dependency')
  }

  const { cacheRepository, cdnRepository } = repositories

  if (!cacheRepository) {
    throw new Error('missing required cache repository')
  }

  if (!cdnRepository) {
    throw new Error('missing required cdn repository')
  }

  async function renderSvgTemplateFile(templateFileObj) {
    const cacheResult = templateFileObj.cacheKey ?
      await cacheRepository.get(templateFileObj.cacheKey) :
      undefined

    if (cacheResult) {
      return cacheResult
    }

    const { saveAsPng } = container.services.svgToPng
    const { name, markup, opts } = templateFileObj
    const pngFile = await saveAsPng(name, markup, opts)

    // Upload the file to the CDN
    const secureUrl = await cdnRepository.upload(pngFile)

    if (templateFileObj.cacheKey) {
      cacheRepository.set(templateFileObj.cacheKey, secureUrl)
    }

    return secureUrl

    //return {
      //filename: 'dunamiLogo.png',
      //type: 'image/png',
      //content_id: 'dunami-logo',
      //content: ''
    //}
  }

  async function renderTemplateFile(name) {
    const templateFileObj = templates[name]

    if (!templateFileObj) {
      return
    }

    switch(templateFileObj.type) {
      case 'svg':
        return await renderSvgTemplateFile(templateFileObj)
      default:
        return
    }
  }

  async function renderVolumeChangeTemplate(opts={}) {
    const templateName = 'volumeChange'
    const templateObj = templates[templateName]

    if (!templateObj) {
      throw new Error('missing required volume change template')
    }

    const files = templateObj.files ?
      await Promise.all(templateObj.files.map(renderTemplateFile)) :
      []

    const baseArgs = Object.assign({}, opts, { files })

    return {
      html: ejs.render(templateObj.markup, baseArgs),
      files,
    }
  }

  return {
    renderVolumeChangeTemplate
  }
}

module.exports = Object.create({connect})
