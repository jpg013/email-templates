// http://localhost:3030/render_template/alerts?alert_types=volume&app_environment=appdev.dunami&stream_end_date=2017-12-26T17:03:49.069Z&analysis_name=kbhersh&analysis_id=13504&folder_name=KC Devs&folder_id=1169&stream_frequency=hourly&new_post_count=234&stream_period=One month&image_source=base_64_string
const express         = require('express')
const httpStatus      = require('http-status-codes')
const sgMail          = require('@sendgrid/mail')
const winston         = require('winston')
const cleanupTmpFiles = require('../../bin/cleanupTmpFiles')

// sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const ALERT_TEMPLATE_ID = 'alert_template'

const connect = container => {
  const { services, pathSettings, models, fileHelpers } = container

  if (!services || !pathSettings || !models || !fileHelpers) {
    throw new Error('missing required dependency')
  }

  const { templateEngine, d3Charts, svgToPng, cdn } = services

  if (!templateEngine || !d3Charts || !svgToPng || !cdn) {
    throw new Error('missing required dependency')
  }

  const { buildD3Chart } = d3Charts
  const { convertSvgToPng } = svgToPng
  const { compileTemplate } = templateEngine

  const controller = express.Router()

  // ======================================================
  // Response Handling
  // ======================================================
  const handleResponse = (req, res, next) => {
    res.status(httpStatus.OK).send(req.results)
  }

  // ======================================================
  // Controller Methods
  // ======================================================
  function sendEmail(html) {
    const msg = {
      to: 'jpg013@gmail.com',
      from: 'justin.graber@pathar.net',
      subject: 'Email Template Test',
      html
    };
    sgMail.send(msg);
  }

  async function validateRequest(req, res, next) {
    const data = req.method === 'GET' ? req.query : req.body

    // Hack for 'GET' query params, convert strings to array
    if (data.alert_types && typeof data.alert_types === 'string') {
      data.alert_types = data.alert_types.split(',').map(cur => cur.trim())
    }

    // Build the template data model
    try {
      req.templateDataModel = await models.validate(data, 'alertTemplateRequest')
    } catch(err) {
      return next(err)
    }

    // Build the compiled template
    try {
      req.compiledTemplate = compileTemplate(ALERT_TEMPLATE_ID)
    } catch(err) {
      return next(err)
    }

    next()
  }

  function buildTemplateAttachments(arr, templateData) {
    return arr.map(async cur => {
      const contentId = fileHelpers.generateUniqueFileName(cur.attachmentName)
      const pngFileId = `${contentId}.png`
      const svgFileId = `${contentId}.svg`
      const fileData = {
        file_id: pngFileId,
        content_id: contentId
      }
      const chartSvg = buildD3Chart(cur.attachmentName, cur.markup, templateData[cur.dataProp])

      await fileHelpers.writeFileStreamAsync(chartSvg, fileHelpers.makeTmpFilePath(svgFileId))
      await convertSvgToPng(svgFileId, pngFileId, cur.opts)

      const bitmap = await fileHelpers.readTmpFile(pngFileId)

      return (templateData.image_source === 'base_64_string') ?
        Object.assign(fileData, {}, {
          base_64_string: bitmap.toString('base64')
        }) :
        fileData
    })
  }

  function buildTemplateImages(imageArr, templateData) {
    return imageArr.map(({file_id}) => {
      const fileData = Object.assign({}, { url_src: cdn.makeObjectLink(file_id) })

      // async fire and forget
      fileHelpers.readStaticFile(file_id)
        .then(fileBitmap => cdn.putObject(file_id, fileBitmap, { upsert: false }))

      return fileData
    })
  }

  // Compile the template static images and d3 charts
  async function compileTemplateFiles(req, res, next) {
    const { templateDataModel, compiledTemplate } = req
    const { images, attachments } = compiledTemplate

    // F&F - Lazy load images
    const templateImages = buildTemplateImages(images.slice(), templateDataModel)
    const templateAttachments = await Promise.all(buildTemplateAttachments(attachments.slice(), templateDataModel))


    req.templateDataModel = Object.assign({}, templateDataModel, {
      images: templateImages,
      attachments: templateAttachments
    })

    next()
  }

  async function renderTemplate(req, res, next) {
    const { compiledTemplate, templateDataModel } = req

    try {
      const renderArgs = { ...templateDataModel }
      const templateObj = {
        html: compiledTemplate.render(renderArgs),
        attachments: templateDataModel.attachments
      }

      req.results = await models.validate(templateObj, 'renderedTemplate')
      next()
    } catch(err) {
      // TODO: handle error
      console.log(err)
    }
  }

  function serveTemplateHTML(req, res, next) {
    //sendEmail(req.results.html)
    res.set('Content-Type', 'text/html')
    res.send(Buffer.from(req.results.html))
  }

  function doCleanup(req, res, next) {
    cleanupTmpFiles(fileHelpers)
    next()
  }

  // ======================================================
  // Controller Routes
  // ======================================================
  controller.post('/', validateRequest, compileTemplateFiles, renderTemplate, doCleanup, handleResponse)
  controller.get('/', validateRequest, compileTemplateFiles, renderTemplate, serveTemplateHTML)

  return controller
}

module.exports = Object.assign({ connect })
