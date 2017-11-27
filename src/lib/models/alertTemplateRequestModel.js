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
    __type: joi.string().default('alert', 'type of model')
  }

  const validate = object => {
    const {
      alert_types, analysis_name, analysis_link, folder_name, folder_link,
      stream_start_date, stream_end_date, stream_refresh_period, new_post_count
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
      sentiment
    }

    return joi.validate(schemaData, schema)
  }

  return {
    validate
  }
}

module.exports = alertTemplateRequestModel
