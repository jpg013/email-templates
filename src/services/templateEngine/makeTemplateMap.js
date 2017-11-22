const file = require('../../libs/file')
const path = require('path')

function mapTemplateViewFiles(views, files) {
  return views.map(v => {
    if (!v.files || !v.files.length) {
      return v
    }

    const mappedFiles = v.files.map(cur => {
      const file = files.find(f => f.id === cur.id)

      if (!file) {
        throw new Error('missing file')
      }

      return Object.assign({}, cur, file)
    })

    return Object.assign({}, v, {
      files: mappedFiles
    })
  })
  .reduce((acc, cur) => {
    acc[cur.id] = cur
    return acc
  }, {})
}

async function loadTemplateFiles() {
  // Read in svgs
  const files = await file.readDirAsync(path.resolve(__dirname, 'files'))
  return files.map(f => require(`./files/${f}`))
}

async function loadTemplateViews() {
  // Read in views
  const views = await file.readDirAsync(path.resolve(__dirname, 'views'))
  return views.map(v => require(`./views/${v}`))
}

module.exports = async () => {
  const templateViews = await loadTemplateViews()
  const templateFiles = await loadTemplateFiles()

  return mapTemplateViewFiles(templateViews, templateFiles)
}
