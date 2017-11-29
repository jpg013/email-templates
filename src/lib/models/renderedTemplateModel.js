const renderedTemplateModel = joi => {
  const imageSchema = joi.object().keys({
    url_src: joi.string(),
  });

  const attachmentSchema = joi.object().keys({
    file_id: joi.string().required(),
    content_id: joi.string().required(),
    url_src: joi.string()
  });

  const schema = {
    html: joi.string(),
    images: joi.array().items(imageSchema),
    attachments: joi.array().items(attachmentSchema)
  }

  const validate = object => {
    const { html, images, attachments } = object;

    const props = { html, images, attachments }

    return joi.validate(props, schema)
  }

  return {
    validate
  }
}

module.exports = renderedTemplateModel
