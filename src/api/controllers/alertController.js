// http://localhost:3000/templates/alerts?alert_types=volume&analysis_name=KBHERSH&analysis_link=https%3A%2F%2Fappdev.dunami.com%2F%23%2Fchannel%2F1169%2Fanalysis%2F13504&folder_name=KC%20Devs&folder_link=https%3A%2F%2Fappdev.dunami.com%2F%23%2Fchannel%2F1169&stream_start_date=2017-10-26T17%3A03%3A49.069Z&stream_end_date=2017-12-26T17%3A03%3A49.069Z&stream_frequency=daily&new_post_count=234&image_source=link
const express         = require('express')
const httpStatus      = require('http-status-codes')
const sgMail          = require('@sendgrid/mail')
const winston         = require('winston')
const cleanupTmpFiles = require('../../bin/cleanupTmpFiles')

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
  const { convertSvgToPng } = svgToPng
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

  function buildTemplateAttachments(arr, templateData) {
    return arr.map(async cur => {
      const contentId = fileHelpers.generateUniqueFileName(cur.attachmentName)
      const pngFileId = `${contentId}.png`
      const svgFileId = `${contentId}.svg`

      const fileData = {
        file_id: pngFileId,
        content_id: contentId,
        url_src: cdn.makeObjectLink(`${cur.attachmentName}.png`),
      }

      if (templateData.image_source === 'link') {
        const objectExists = await cdn.doesObjectExist(`${cur.attachmentName}.png`)

        if (!objectExists) {
          const chartSvg = buildD3Chart(cur.attachmentName, cur.markup, templateData[cur.dataProp])

          await fileHelpers.writeFileStreamAsync(chartSvg, fileHelpers.makeTmpFilePath(svgFileId))
          await convertSvgToPng(svgFileId, pngFileId, fileConverter, cur.opts)

          const bitmap = await fileHelpers.readTmpFile(pngFileId)
          cdn.putObject(`${cur.attachmentName}.png`, bitmap)
        }
      } else {
        const chartSvg = buildD3Chart(cur.attachmentName, cur.markup, templateData[cur.dataProp])

        await fileHelpers.writeFileStreamAsync(chartSvg, fileHelpers.makeTmpFilePath(svgFileId))
        await convertSvgToPng(svgFileId, pngFileId, fileConverter, cur.opts)

        const bitmap = await fileHelpers.readTmpFile(pngFileId)
        const zippedValue = await fileHelpers.deflateFile(bitmap)

        await repository.set(pngFileId, zippedValue.toString('base64'))
        repository.expire(pngFileId, 600) // expire in 10 minutes
      }

      return fileData
    })
  }

  function buildTemplateImages(imageArr, templateData) {
    return imageArr.map(({file_id}) => {
      const fileData = Object.assign({}, {
        url_src: cdn.makeObjectLink(file_id),
      })

      // async fire and forget
      fileHelpers.readStaticFile(file_id)
        .then(fileBitmap => cdn.putObject(file_id, fileBitmap, { upsert: false }))

      return fileData
    })
  }

  // Compile the template static images and d3 charts
  async function compileTemplateFiles(req, res, next) {
    const { templateData, compiledTemplate } = req
    const { images, attachments } = compiledTemplate

    // Lazy load images
    const imgPromises = Promise.all(buildTemplateImages(images.slice(), templateData))
    const attPromises = Promise.all(buildTemplateAttachments(attachments.slice(), templateData))

    const [templateImages, templateAttachments] = await Promise.all([imgPromises, attPromises])

    req.templateImages = templateImages
    req.templateAttachments = templateAttachments
    next()
  }

  async function renderTemplate(req, res, next) {
    const { compiledTemplate, templateData, templateImages: images, templateAttachments: attachments } = req

    try {
      const renderArgs = {
        ...templateData,
        images,
        attachments
      }

      const templateObj = {
        html: compiledTemplate.render(renderArgs),
        images,
        attachments
      }

      req.results = await models.validate(templateObj, 'template')
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

  function cleanupFiles(req, res, next) {
    cleanupTmpFiles(fileHelpers)
    next()
  }

  // ======================================================
  // Controller Routes
  // ======================================================
  controller.post('/', validateRequest, compileTemplateFiles, renderTemplate, cleanupFiles, handleResponse)
  controller.get('/', validateRequest, compileTemplateFiles, renderTemplate, cleanupFiles, serveTemplateHTML)

  return controller
}

module.exports = Object.assign({ connect })
