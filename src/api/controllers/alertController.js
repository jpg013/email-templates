//http://localhost:3000/templates/alerts?alert_types=volume&analysis_name=KBHERSH&analysis_link=https%3A%2F%2Fappdev.dunami.com%2F%23%2Fchannel%2F1169%2Fanalysis%2F13504&folder_name=KC%20Devs&folder_link=https%3A%2F%2Fappdev.dunami.com%2F%23%2Fchannel%2F1169&stream_start_date=2017-10-26T17%3A03%3A49.069Z&stream_end_date=2017-12-26T17%3A03%3A49.069Z&stream_refresh_period=daily&new_post_count=234
const express    = require('express')
const httpStatus = require('http-status-codes')
const sgMail     = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const ALERT_TEMPLATE_ID = 'alert_template'

const connect = container => {
  const { services, repository, pathSettings, models, fileHelpers } = container

  if (!services || !repository || !pathSettings || !models || !fileHelpers) {
    throw new Error('missing required dependency')
  }

  const { templateEngine, d3Charts, svgToPng, fileConverter, cdn } = services

  if (!templateEngine || !d3Charts || !svgToPng || !fileConverter || !cdn) {
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
  function sendEmail(html) {
    const msg = {
      to: 'dunami.test@yahoo.com',
      from: 'justin.graber@pathar.net',
      subject: 'Email Template Test',
      html
    };
    sgMail.send(msg);
  }

  async function validateRequest(req, res, next) {
    const data = req.method === 'GET' ? req.query : req.body

    // Hack for 'GET' query params, convert strings to array
    if (typeof data.alert_types !== 'object') {
      data.alert_types = data.alert_types.split(',')
    }

    // Build the template data model
    try {
      req.templateData = await models.validate(data, 'alertTemplateRequest')
    } catch(err) {
      return res.status(httpStatus.BAD_REQUEST).send({err: err})
    }
    // Build the compiled template
    try {
      req.compiledTemplate = compileTemplate(ALERT_TEMPLATE_ID)
    } catch(err) {
      return res.status(httpStatus.BAD_REQUEST).send({err: err})
    }
    next()
  }

  function renderTemplateChart(fileId, markup, data) {
    const compiledSvgChart = buildD3Chart(fileId, markup, templateDataModel[dataProp])

    return writeSvgToFile(fileId, compiledSvgChart)
      .then(svgFile => convertSvgToPng(fileId, svgFile, fileConverter))
  }

  async function uploadImageToCloud(fileId) {
    const metaData = await cdn.retrieveObjectMetaData(fileId)

    // Object exists?
    if (metaData) {
      return
    }

    await cdn.putPublicObject(fileId, await fileHelpers.readStaticImg(fileId))
  }

  async function uploadImageToCache(fileId) {
    const fileExists = await repository.exists(fileId)

    // File exists
    if (fileExists) {
      return
    }

    const bitmap = await fileHelpers.readStaticImg(fileId)
    const zippedValue = await fileHelpers.deflateFile(bitmap)

    repository.set(fileId, zippedValue.toString('base64'))
  }

  function makeTemplateImages(imageArr, imageSource) {
    return imageArr.map(cur => {
      const imageFile = Object.assign({}, cur, {
        url_link: cdn.makeObjectLink(cur.file_id)
      })

      // async fire and forget
      if (imageSource === 'link') {
        uploadImageToCloud(cur.file_id)
      } else {
        uploadImageToCache(cur.file_id)
      }

      return imageFile
    })
  }

  // Compile the template static images and d3 charts
  async function makeTemplateFiles(req, res, next) {
    const { templateData, compiledTemplate } = req
    const { images, charts } = compiledTemplate

    // Lazy load images
    const filePromises = makeTemplateImages(images.slice(), templateData.image_source)

    req.templateFiles = await Promise.all(filePromises)
    next()

    //compiledTemplate.charts = await Promise.all(compiledTemplate.charts.map(async chart => {
      //const { id, dataProp, markup } = chart

      //return pngFile
    //}))

    //next()
  }

  async function renderTemplate(req, res, next) {
    const { compiledTemplate, templateData, templateFiles: files } = req

    try {
      const renderArgs = {
        ...templateData,
        files
      }

      const templateObj = {
        html: compiledTemplate.render(renderArgs),
        files
      }

      req.results = await models.validate(templateObj, 'template')
      next()
    } catch(err) {
      // TODO: handle error
      console.log(err)
    }
  }

  function serveTemplateHTML(req, res, next) {
    // sendEmail(req.results.html)
    res.set('Content-Type', 'text/html')
    res.send(Buffer.from(req.results.html))
  }

  // ======================================================
  // Controller Routes
  // ======================================================
  controller.post('/', validateRequest, makeTemplateFiles, renderTemplate, handleResponse)
  controller.get('/', validateRequest, makeTemplateFiles, renderTemplate, serveTemplateHTML)

  return controller
}

module.exports = Object.assign({ connect })
