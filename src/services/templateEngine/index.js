const ejs = require('ejs')

const volumeChangeTemplateDefinition = ['volumeChangeHeader']

async function connect(container) {
  const { templates, repository } = container

  if (!templates) {
    throw new Error('missing required views dependency')
  }

  if (!repository) {
    throw new Error('missing required repository dependency')
  }

  async function renderTemplateMarkup(template) {
    const children = await Promise.all(template.children.map(renderTemplateTree))
    const args = Object.assign({}, { children })

    return ejs.render(template.markup, args)
  }

  async function renderSvg(template) {
    const cacheResult = await repository.get(template.name)

    if (cacheResult) {
      return cacheResult
    }

    const { svgToPngBase64Encoded } = container.services.svgToPng

    const base_64_str = await svgToPngBase64Encoded(template.markup, template.opts)

    // Update Cache - fire and forget
    repository.set(template.name, base_64_str)

    const args = Object.assign({}, { height: 100, width: 100}, {
      base_64_str,
      ...template.opts
    })

    const renderedTemplate = ejs.render(templates.embeddedImage.markup, args)

    // Update Cache - fire and forget
    repository.set(template.name, renderedTemplate)

    return renderedTemplate
  }

  async function renderTemplateTree(template) {
    if (!template.isSvg) {
      return await renderTemplateMarkup(template)
    } else {
      return await renderSvg(template)
    }
  }

  async function renderVolumeChangeTemplate() {
    const templateChilden = [
      templates.volumeChangeHeader
    ]

    const base = Object.assign({}, templates.base, {
      children: templateChilden
    })

    return await renderTemplateTree(base)
  }

  return {
    renderVolumeChangeTemplate
  }
}

module.exports = Object.create({connect})
