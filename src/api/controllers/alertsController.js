const express    = require('express')
const httpStatus = require('http-status-codes')
const moment     = require('moment')
const path       = require('path')

const ALERTS_TEMPLATE_ID = 'alerts'

const connect = container => {
  const { services, repository, pathSettings, models } = container

  if (!services || !repository || !pathSettings || !models) {
    throw new Error('missing required dependency')
  }

  const { templateEngine, d3Charts, svgToPng } = services

  if (!templateEngine || !d3Charts || !svgToPng) {
    throw new Error('missing required dependency')
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
    alertTemplateData
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
      req.alertTemplateData = await models.validate(req.body, 'alertTemplateData')
      next()
    } catch({ details }) {
      console.log(details)
      return res.status(httpStatus.BAD_REQUEST).send({errors: details.map(cur => ({ message: cur.message }))})
    }
  }

  function compileTemplate(req, res, next) {
    try {
      req.compiledTemplate = templateEngine.compileTemplate(ALERTS_TEMPLATE_ID)
    } catch(e) {
      // handle error
    }
    next()
  }

  async function compileTemplateFiles(req, res, next) {
    const { compiledTemplate } = req
    const files = await Promise.all(compiledTpl.files.map(f => cacheRepository.get(f)))
  }

  // ======================================================
  // Controller Routes
  // ======================================================
  controller.post('/', validateRequest, compileTemplate, handlePostAlerts, responseHandler)

  return controller
}

module.exports = Object.assign({ connect })
