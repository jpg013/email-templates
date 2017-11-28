const templateModel = joi => {
  const fileSchema = joi.object().keys({
    file_id: joi.string().required(),
    content_id: joi.string().required(),
    url_link: joi.string(),
    type: joi.string().allow('url_link', 'attachment')
  });

  const schema = {
    html: joi.string(),
    files: joi.array().items(fileSchema)
  }

  const validate = object => {
    const { html, files } = object;

    const schemaData = { html, files }

    return joi.validate(schemaData, schema)
  }

  return {
    validate
  }
}

module.exports = templateModel
