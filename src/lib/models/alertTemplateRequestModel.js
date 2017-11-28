const moment = require('moment')

const alertTemplateRequestModel = joi => {
  const schema = {
    alert_types: joi.array().min(1).required(),
    analysis_name: joi.string().required(),
    analysis_link: joi.string().required(),
    folder_name: joi.string().required(),
    folder_link: joi.string().required(),
    stream_start_date: joi.date().required(),
    formatted_stream_start_date: joi.string().required(),
    formatted_stream_end_date: joi.string().required(),
    stream_end_date: joi.date().required(),
    stream_frequency: joi.string().required().allow('hourly', 'daily', 'weekly'),
    new_post_count: joi.number().required(),
    sentiment: joi.array(),
    stream_period: joi.string().allow('One week', 'One month', 'Three months', 'Six months', 'One year'),
    image_source: joi.string().allow('embedded_base_64', 'embedded_attachment', 'link').default('link')
  }

  const computeStreamPeriod = (startDate, endDate) => {
    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (dayDiff <= 7) {
      return 'One week'
    } else if (dayDiff <= 31) {
      return 'One month'
    } else if (dayDiff <= 93) {
      return 'Three months'
    } else if (dayDiff <= 186) {
      return 'Six months'
    } else {
      return 'One year'
    }
  }

  const validate = object => {
    const {
      alert_types, analysis_name, analysis_link, folder_name, folder_link,
      stream_start_date, stream_end_date, stream_frequency, new_post_count,
      image_source
    } = object;

    const streamStartDate = new Date(stream_start_date)

    if (isNaN(streamStartDate.getTime())) {
      throw new Error('stream start date must be a valid date string')
    }

    const streamEndDate = new Date(stream_end_date)

    if (isNaN(streamEndDate.getTime())) {
      throw new Error('stream end date must be a valid date string')
    }

    // Calculate stream period
    const stream_period = computeStreamPeriod(streamEndDate, streamStartDate)

    const formatted_stream_start_date = moment().format('MMMM Do YYYY');
    const formatted_stream_end_date = moment().format('MMMM Do YYYY');

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
      stream_frequency,
      new_post_count,
      sentiment,
      image_source,
      stream_period,
      formatted_stream_start_date,
      formatted_stream_end_date
    }

    return joi.validate(schemaData, schema)
  }

  return {
    validate
  }
}

module.exports = alertTemplateRequestModel
