const express    = require('express')
const httpStatus = require('http-status-codes')
const moment     = require('moment')
const dial       = require('../../libs/dial')
const path       = require('path')

const connect = container => {
  const { services, repositories, pathSettings } = container

  if (!services || !repositories) {
    throw new Error('missing required dependencies')
  }

  const { templateEngine, svg } = services
  const { cacheRepository } = repositories

  if (!templateEngine || !svg || !cacheRepository) {
    throw new Error('missing required dependencies')
  }

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

  const responseHandler = (req, res) => {
    if (req.error) {
      const {status, error} = getErrorResponse(req.error)
      res.status(status).send({error})
    } else {
      const {results} = req
      res.status(httpStatus.OK).send(results)
    }
  }

  function sendEmailTemplate({html, attachments}) {
    const body = {
      'personalizations': [
        {
          to: [{email: 'justin.graber@dunami.com'}],
          subject: 'Hello, World!'
        }
      ],
      from: {
        email: 'dev@innosolpro.com'
      },
      content: [
        {
          type: 'text/html',
          value: html
        }
      ],
      // attachments
    }

    const headers = {
      Authorization: `Bearer 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`
    }

    const opts = {
      headers,
      json: body
    }

    //dial('https://api.sendgrid.com/v3/mail/send', 'post', opts)
  }

  async function buildTemplateFile(tplFile) {
    const cachedFile = tplFile.cacheKey ?
      await cacheRepository.get(tplFile.cacheKey) :
      undefined

    if (cachedFile) {
      return cachedFile
    }

    const svgFile = await svg.writeFileToSvg(tplFile)
    const pngFileData = await svg.convertSvgToPng(svgFile, tplFile.opts)

    if (tplFile.cacheKey) {
      cacheRepository.set(tplFile.cacheKey, pngFileData)
    }

    return pngFileData
  }

  // ======================================================
  // Controller Methods
  // ======================================================
  async function handlePostAlerts(req, res, next) {
    try {
      const templateId = 'alerts'
      const alertData = req.body

      const compiledTpl = templateEngine.compileTemplate(templateId, alertData)
      const files = await Promise.all(compiledTpl.files.map(f => cacheRepository.get(f)))

      const renderArgs = {
        ...alertData,
        files
      }

      req.results = templateEngine.renderTemplate(compiledTpl.compiledMarkup, renderArgs)

      // This is complete test code, remove once finished
      // sendEmailTemplate(results)
    } catch(e) {
      console.log(e)
      req.error = e
    } finally {
      next()
    }
  }

  function generateFakeRequestData(req, res, next) {
    req.body = {
      analysisName: 'kbhersh',
      analysisLink: 'https://appdev.dunami.com/#/channel/1169/analysis/13504/posts',
      folderName: 'KC Devs',
      sentiment: [
        {
          type: 'Negative',
          percent: .20
        },
        {
          type: 'Neutral',
          percent: .30
        },
        {
          type: 'Positive',
          percent: .50
        }
      ]
    }

    next()
  }

  // ======================================================
  // Controller Routes
  // ======================================================
  controller.get('/', generateFakeRequestData, handlePostAlerts, responseHandler)

  return controller
}

module.exports = Object.assign({ connect })
