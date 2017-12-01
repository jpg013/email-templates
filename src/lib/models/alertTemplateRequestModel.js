const moment = require('moment')
const { RequestValidationError } = require('../../bin/customErrors')

// This is all temp code that will go away
const makeArrayOfNItems = n => {
  return Array.apply(null, {length: n}).map(Number.call, Number);
};

const generateRandomCount = () => {
  return Math.floor((Math.random() * 100) + 1)
}

const generatePostVolume = () => {
  const idx = 50
  const data = makeArrayOfNItems(50).map(cur => {
    const day = new Date()
    day.setDate(day.getDate() - (idx - cur))

    return {
      day,
      positiveCount: generateRandomCount(),
      negativeCount: generateRandomCount(),
      neutralCount: generateRandomCount(),
      unknownCount: generateRandomCount()
    }
  })
  return data
}

const alertTemplateDataModel = (joi, formatError) => {
  const sentimentSchema = joi.object().keys({
    type: joi.string().required(),
    percent: joi.number().required()
  });

  const validAlertTypes = ['post', 'volume', 'sentiment']
  const sentimentTypes = ['positive', 'negative', 'neutral', 'unknown']

  const postSchema = joi.object().keys({
    subject_img_url: joi.string().required(),
    subject_location: joi.string(),
    text: joi.string().required(),
    retweet_count: joi.number().default(0),
    like_count: joi.number().default(0),
    post_date: joi.date().required()
  })

  const volumeSchema = joi.object().keys({
    day: joi.date().required(),
    positiveCount: joi.date().required().default(0),
    negativeCount: joi.number().required().default(0),
    neutralCount: joi.number().required().default(0),
    unknownCount: joi.number().required().default(0)
  })

  const schema = {
    app_environment: joi.string().required().valid('appdev.dunami', 'app.dunami', 'appqa.dunami'),
    alert_types: joi.array().min(1).items(joi.string().valid('post', 'volume', 'sentiment')).required(),
    is_post_alert: joi.boolean().required(),
    is_sentiment_volume_alert: joi.boolean().required(),
    analysis_name: joi.string().required(),
    analysis_id: joi.number().required(),
    analysis_link: joi.string(),
    folder_name: joi.string().required(),
    folder_id: joi.number().required(),
    folder_link: joi.string(),
    stream_end_date: joi.date().required(),
    formatted_stream_end_date: joi.string(),
    stream_frequency: joi.string().required().valid('hourly', 'daily', 'weekly'),
    new_post_count: joi.number().required(),
    sentiment: joi.array(),
    stream_period: joi.string().valid('One week', 'One month', 'Three months', 'Six months', 'One year').required(),
    image_source: joi.string().valid('base_64_string', 'attachment').default('attachment'),
    sentiment: joi.array().items(sentimentSchema).when('is_sentiment_volume_alert', { is: true, then: joi.required() }),
    posts: joi.array().items(postSchema).when('is_post_alert', { is: true, then: joi.required() }),
    post_volume: joi.array().items(volumeSchema).when('is_sentiment_volume_alert', { is: true, then: joi.required() }),
  }

  const validate = object => {
    const post_volume = generatePostVolume()

    const {
      app_environment, alert_types, analysis_name, analysis_id, folder_name, folder_id,
      stream_end_date, stream_frequency, stream_period, new_post_count, posts, image_source
    } = object;

    // Validate the alert_type
    if (!alert_types) {
      throw new RequestValidationError('alert_types is a required field')
    }

    if (!Array.isArray(alert_types)) {
      throw new RequestValidationError('Invalid alert_types value')
    }

    const is_post_alert = !!alert_types.includes('post')
    const is_sentiment_volume_alert = !!alert_types.includes('sentiment') || !!alert_types.includes('volume')

    // Validate stream end date
    const streamEndDate = new Date(stream_end_date)

    if (isNaN(streamEndDate.getTime())) {
      throw new RequestValidationError('Invalid stream end date value')
    }

    // Computed Values
    const formatted_stream_end_date = moment(stream_end_date).format('MMMM Do YYYY');
    const analysis_link = `https://${app_environment}/#/channel/${folder_id}/analysis/${analysis_id}`
    const folder_link = `https://${app_environment}/#/channel/${folder_id}`

    const schemaData = {
      app_environment,
      alert_types,
      analysis_name,
      analysis_id,
      analysis_link,
      folder_name,
      folder_id,
      folder_link,
      stream_end_date,
      formatted_stream_end_date,
      new_post_count,
      stream_period,
      stream_frequency,
      is_post_alert,
      is_sentiment_volume_alert,
      post_volume,
      posts,
      image_source
    }

    if (is_sentiment_volume_alert) {
      if (!post_volume) {
        throw new RequestValidationError('post_volume is a required field')
      }

      if (!Array.isArray(post_volume)) {
        throw new RequestValidationError('Invalid post_volume value')
      }

      const base = {
        positiveCount: 0,
        negativeCount: 0,
        neutralCount: 0,
        unknownCount: 0,
        totalCount: 0
      }

      const sentimentCounts = post_volume.reduce((acc, cur) => {
        const { positiveCount, negativeCount, neutralCount, unknownCount } = cur
        const totalInc = positiveCount + negativeCount + neutralCount + unknownCount

        return {
          positiveCount: acc.positiveCount + positiveCount,
          negativeCount: acc.negativeCount + negativeCount,
          neutralCount: acc.neutralCount + neutralCount,
          unknownCount: acc.unknownCount + unknownCount,
          totalCount: acc.totalCount + totalInc
        }
      }, base)

      const sentiment = sentimentTypes.map(cur => {
        const key = `${cur}Count`
        return {
          type: cur,
          percent: sentimentCounts[key] / sentimentCounts.totalCount
        }
      })

      schemaData.sentiment = sentiment
    }

    const { value, error } = joi.validate(schemaData, schema)
    
    if (error) {
      throw new RequestValidationError(formatError(error) || 'Bad request data.')
    }

    return value
  }

  return {
    validate
  }
}

module.exports = alertTemplateDataModel
