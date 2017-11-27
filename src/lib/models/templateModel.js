const templateModel = joi => {
  const fileSchema = joi.object().keys({
    file: joi.string(),
    content_id: joi.string()
  });

  const schema = {
    html: joi.string(),
    files: joi.array().items(fileSchema),
    __type: joi.string().default('alert_template_request', 'type of model')
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
