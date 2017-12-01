const renderedTemplateModel = joi => {
  const attachmentSchema = joi.object().keys({
    file_id: joi.string().required(),
    content_id: joi.string().required(),
    base_64_string: joi.string()
  });

  const schema = {
    html: joi.string(),
    attachments: joi.array().items(attachmentSchema)
  }

  const validate = object => {
    const { html, attachments } = object;

    const props = { html, attachments }

    return joi.validate(props, schema)
  }

  return {
    validate
  }
}

module.exports = renderedTemplateModel
