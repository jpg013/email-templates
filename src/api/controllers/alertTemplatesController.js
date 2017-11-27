const express    = require('express')
const httpStatus = require('http-status-codes')

const ALERT_TEMPLATE_ID = 'alert_template'

const connect = container => {
  const { services, repository, pathSettings, models } = container

  if (!services || !repository || !pathSettings || !models) {
    throw new Error('missing required dependency')
  }

  const { templateEngine, d3Charts, svgToPng, fileConverter } = services

  if (!templateEngine || !d3Charts || !svgToPng || !fileConverter) {
    throw new Error('missing required dependency')
  }

  const { buildD3Chart } = d3Charts
  const { convertSvgToPng, writeSvgToFile } = svgToPng
  const { compileTemplate } = templateEngine
  const controller = express.Router()

  // ======================================================
  // Response Error Messages
  // ======================================================
  const getErrorResponse = error => {
    switch(error) {
      case 'Bad request data.':
        return {
          status: 400,
          error
        }
      default:
        return {
          status: 500,
          error
        }
    }
  }

  const handleResponse = (req, res) => {
    if (req.error) {
      const { status, error } = getErrorResponse(req.error)
      res.status(status).send({error})
    } else {
      console.log(req.compiledTemplate.images)
      console.log(req.compiledTemplate.charts)

      const { results } = req
      res.status(httpStatus.OK).send(results)
    }
  }

  // ======================================================
  // Controller Methods
  // ======================================================
  async function handlePostAlerts(req, res, next) {
    try {
      const templateId = 'alerts'

      const compiledTpl = templateEngine.compileTemplate(templateId)
      const files = await Promise.all(compiledTpl.files.map(f => cacheRepository.get(f)))

      const renderArgs = {
        ...alertTemplateData,
        files
      }

      req.results = templateEngine.renderTemplate(compiledTpl.compiledMarkup, renderArgs)
    } catch(e) {
      console.log(e)
      req.error = e
    } finally {
      next()
    }
  }

  async function validateRequest(req, res, next) {
    try {
      req.templateDataModel = await models.validate(req.body, 'alertTemplateRequest')
      next()
    } catch(err) {

      return res.status(httpStatus.BAD_REQUEST).send({err: err})
    }
  }

  async function makeCompiledTemplate(templateId, req, res, next) {
    try {
      const cachedValue = await repository.get(templateId)
      req.compiledTemplate = cachedValue ? cachedValue : compileTemplate(templateId)
      // F&F cache
      repository.set(templateId, req.compiledTemplate)
      next()
    } catch(e) {
      console.log(e)
      // TODO: handle error
    }
  }

  async function renderTemplateCharts(req, res, next) {
    const { templateDataModel, compiledTemplate } = req

    compiledTemplate.charts = await Promise.all(compiledTemplate.charts.map(async chart => {
      const { id, dataProp, markup } = chart

      const compiledSvgChart = buildD3Chart(id, markup, templateDataModel[dataProp])

      const svgFile = await writeSvgToFile(compiledSvgChart)
      const pngFile = await convertSvgToPng(fileConverter, svgFile)

      return pngFile
    }))

    next()
  }

  // ======================================================
  // Controller Routes
  // ======================================================
  controller.post('/', validateRequest, makeCompiledTemplate.bind(null, ALERT_TEMPLATE_ID), renderTemplateCharts, handleResponse)

  return controller
}

module.exports = Object.assign({ connect })
