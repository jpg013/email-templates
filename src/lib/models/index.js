const joi                       = require('joi')
const alertTemplateRequestModel = require('./alertTemplateRequestModel')
const renderedTemplateModel     = require('./renderedTemplateModel')
const customErrors              = require('./')

const formatSchemaError = err => {
  if (!err || typeof err !== 'object') {
    return
  }

  const details = err.details ? err.details[0] : undefined

  if (!details) {
    return
  }

  const errKey = details.path.reduce((acc, cur) => {
    if (!acc.length) {
      return cur
    }

    return typeof cur === 'string' ? `${acc}.${cur}` : acc
  }, '')

  const { type, context, message } = details

  switch(type) {
    case 'any.required':
      return `${context.key} is a required field`
    case 'string.base':
    case 'number.base':
      return `Invalid "${errKey}" field. ${message}`
    case 'any.allowOnly':
      return `Invalid "${errKey}" field`
    default:
      return
  }
}

const models = Object.create({
  alertTemplateRequest: alertTemplateRequestModel(joi, formatSchemaError),
  renderedTemplate: renderedTemplateModel(joi, formatSchemaError)
})


const schemaValidator = (object, type) => {
  return new Promise((resolve, reject) => {
    if (!object) {
      return reject (new Error('object to validate not provided'))
    }

    if (!type) {
      return reject (new Error('schema type to validate not provided'))
    }

    const validator = models[type].validate.bind(null, object)

    try {
      const model = validator()

      resolve(model)
    } catch(err) {
      reject(err)
    }
  })
}

module.exports = Object.assign({
  validate: schemaValidator
})
