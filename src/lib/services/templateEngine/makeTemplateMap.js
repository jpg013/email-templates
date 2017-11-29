function buildTemplateMap(templates, attachments) {
  // Map reduce over templates
  return templates.map(tpl => {
    const tplAttachments = tpl.attachments.map(cur => {

      const tplAttachment = attachments.find(i => i.name === cur.attachmentName)

      if (!tplAttachment) {
        throw new Error('missing template attachment')
      }

      return Object.assign({}, cur, { markup: tplAttachment.markup })
    })

    return Object.assign({}, tpl, {
      attachments: tplAttachments
    })
  })
  .reduce((acc, cur) => {
    acc[cur.id] = cur
    return acc
  }, {})
}

module.exports = async (fileHelpers, pathSettings) => {
  const templates = await fileHelpers.loadDirFiles(pathSettings.templatesDir)
  const tplAttachments = await fileHelpers.loadDirFiles(pathSettings.templateAttachmentsDir)

  return buildTemplateMap(templates, tplAttachments)
}
