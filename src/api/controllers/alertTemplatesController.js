//http://localhost:3000/templates/alerts?alert_types=volume&analysis_name=KBHERSH&analysis_link=https%3A%2F%2Fappdev.dunami.com%2F%23%2Fchannel%2F1169%2Fanalysis%2F13504&folder_name=KC%20Devs&folder_link=https%3A%2F%2Fappdev.dunami.com%2F%23%2Fchannel%2F1169&stream_start_date=2017-10-26T17%3A03%3A49.069Z&stream_end_date=2017-12-26T17%3A03%3A49.069Z&stream_refresh_period=daily&new_post_count=234
const express    = require('express')
const httpStatus = require('http-status-codes')

const ALERT_TEMPLATE_ID = 'alert_template'

const connect = container => {
  const { services, repository, pathSettings, models, fileHelpers } = container

  if (!services || !repository || !pathSettings || !models || !fileHelpers) {
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
      res.status(httpStatus.OK).send(req.results)
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
    const data = req.method === 'GET' ? req.query : req.body

    if (typeof data.alert_types !== 'object') {
      data.alert_types = data.alert_types.split(',')
    }

    try {
      req.templateDataModel = await models.validate(data, 'alertTemplateRequest')
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

  function loadImagesIntoCache(images) {
    images.forEach(({file_id}) => {
      return repository.exists(file_id)
        .then(val => {
          if (val) {
            return
          }

          fileHelpers.readStaticImg(file_id)
            .then(fileHelpers.deflateFile)
            .then(zippedValue => repository.set(file_id, zippedValue.toString('base64')))
      })
    })
  }

  async function compileTemplateFiles(req, res, next) {
    const { templateDataModel, compiledTemplate } = req
    const { images, charts } = compiledTemplate

    // Lazy load images into cache
    loadImagesIntoCache(images.slice())

    const files = images.slice()

    req.templateFiles = await Promise.all(files)

    next()

    //compiledTemplate.charts = await Promise.all(compiledTemplate.charts.map(async chart => {
      //const { id, dataProp, markup } = chart

      //return pngFile
    //}))

    //next()
  }

  function mapFilesToBase64(req, res, next) {
    const { compiledTemplate, templateDataModel, templateFiles: files } = req

    const promiseArr = files.map(file => {
      return repository.get(file.file_id)
        .then(zippedValue => fileHelpers.inflateFile(Buffer.from(zippedValue, 'base64')))
        .then(bitmap => {
          return Object.assign({}, file, { base_64_string: bitmap.toString('base64')})
        })
    })

    return Promise.all(promiseArr).then(resp => {
      req.templateFiles = resp.slice()
      next()
    })
  }

  async function makeTemplateModel(req, res, next) {
    const { compiledTemplate, templateDataModel, templateFiles: files } = req

    try {
      const renderArgs = {
        ...templateDataModel,
        files,
        embedFiles: req.method === 'GET'
      }

      const templateModelData = {
        html: compiledTemplate.render(renderArgs),
        files
      }

      req.results = await models.validate(templateModelData, 'template')
      next()
    } catch(err) {
      // TODO: handle error
      console.log(err)
    }
  }

  function sendTemplateHtml(req, res, next) {
    res.set('Content-Type', 'text/html');
    console.log(req.results.html)
    res.send(Buffer.from(req.results.html))
  }

  // ======================================================
  // Controller Routes
  // ======================================================
  controller.post('/', validateRequest, makeCompiledTemplate.bind(null, ALERT_TEMPLATE_ID), compileTemplateFiles, makeTemplateModel, handleResponse)
  controller.get('/', validateRequest, makeCompiledTemplate.bind(null, ALERT_TEMPLATE_ID), compileTemplateFiles, mapFilesToBase64, makeTemplateModel, sendTemplateHtml)

  return controller
}

module.exports = Object.assign({ connect })
