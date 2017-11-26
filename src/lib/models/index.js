const joi        = require('joi')
const alertTemplateDataModel = require('./alertTemplateData.model')

const models = Object.create({
  alertTemplateData: alertTemplateDataModel(joi)
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

    const { error, value } = validator()

    if (error) {
      return reject(error)
    }

    resolve(value)
  })
}

module.exports = Object.assign({
  validate: schemaValidator,
})
