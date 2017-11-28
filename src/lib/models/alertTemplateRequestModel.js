const alertTemplateRequestModel = joi => {
  const schema = {
    alert_types: joi.array().min(1).required(),
    analysis_name: joi.string().required(),
    analysis_link: joi.string().required(),
    folder_name: joi.string().required(),
    folder_link: joi.string().required(),
    stream_start_date: joi.date().required(),
    stream_end_date: joi.date().required(),
    stream_refresh_period: joi.string().required(),
    new_post_count: joi.number().required(),
    sentiment: joi.array(),
    image_source: joi.string().allow('embedded_base_64', 'embedded_attachment', 'link').default('link')
  }

  const validate = object => {
    const {
      alert_types, analysis_name, analysis_link, folder_name, folder_link,
      stream_start_date, stream_end_date, stream_refresh_period, new_post_count,
      image_source
    } = object;

    const sentiment = [
      {
        type: 'Positive',
        percent: .50
      },
      {
        type: 'Negative',
        percent: .3
      },
      {
        type: 'Neutral',
        percent: .2
      }
    ]

    const schemaData = {
      alert_types,
      analysis_name,
      analysis_link,
      folder_name,
      folder_link,
      stream_start_date,
      stream_end_date,
      stream_refresh_period,
      new_post_count,
      sentiment,
      image_source
    }

    return joi.validate(schemaData, schema)
  }

  return {
    validate
  }
}

module.exports = alertTemplateRequestModel
