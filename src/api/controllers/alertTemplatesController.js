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
  // Response Handling
  // ======================================================
  const handleResponse = (req, res) => {
    if (req.error) {
      const { message, status } = req.error
      res.status(status || httpStatus.INTERNAL_SERVER_ERROR).send({message})
    } else {
      res.status(httpStatus.OK).send(req.templateModel)
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
      //repository.set(templateId, req.compiledTemplate)
      next()
    } catch(e) {
      console.log(e)
      // TODO: handle error
    }
  }

  function renderTemplateChart(fileId, markup, data) {
    const compiledSvgChart = buildD3Chart(fileId, markup, templateDataModel[dataProp])

    return writeSvgToFile(fileId, compiledSvgChart)
      .then(svgFile => convertSvgToPng(fileId, svgFile, fileConverter))
  }

  async function makeTemplateFiles(req, res, next) {
    const { templateDataModel, compiledTemplate } = req
    const { images, charts } = compiledTemplate
    const files = [].concat(images)

    req.templateFiles = await Promise.all(files)

    next()

    //compiledTemplate.charts = await Promise.all(compiledTemplate.charts.map(async chart => {
      //const { id, dataProp, markup } = chart

      //return pngFile
    //}))

    //next()
  }

  async function makeTemplateModel(req, res, next) {
    const { compiledTemplate, templateDataModel, templateFiles: files } = req

    try {
      const renderArgs = {
        ...templateDataModel,
        files
      }

      const templateModelData = {
        html: compiledTemplate.render(renderArgs),
        files
      }

      req.templateModel = await models.validate(templateModelData, 'template')
      next()
    } catch(err) {
      // TODO: handle error
      console.log(err)
    }
  }

  // ======================================================
  // Controller Routes
  // ======================================================
  controller.post('/', validateRequest, makeCompiledTemplate.bind(null, ALERT_TEMPLATE_ID), makeTemplateFiles, makeTemplateModel, handleResponse)

  return controller
}

module.exports = Object.assign({ connect })
