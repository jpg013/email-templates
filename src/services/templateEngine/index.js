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

  async function renderTemplateTree(template) {
    const children = await Promise.all(template.children.map(renderTemplateTree))
    const args = Object.assign({}, { children })
    return ejs.render(template.markup, args)
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
