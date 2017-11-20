const express    = require('express')
const httpStatus = require('http-status-codes')
const moment     = require('moment')
const dial       = require('../../libs/dial')
const path       = require('path')

const APIController = container => {
  const { services, repositories, pathSettings } = container

  if (!services || !repositories) {
    throw new Error('missing required dependencies')
  }

  const { templateEngine, svgToPng } = services
  const { fileConverterRepository, cacheRepository, cdnRepository } = repositories

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

  async function makeSvgTplData(svgTpl) {
    const cachedResult = svgTpl.cacheKey ?
      await cacheRepository.get(svgTpl.cacheKey) :
      undefined

    if (cachedResult) {
      return cachedResult
    }

    const conversion = await svgToPng.convert(svgTpl.id, svgTpl.opts)
    const srcUrl = await cdnRepository.upload(conversion.file)

    const svgData = {
      srcUrl,
      base64Str: conversion.base64Str
    }

    if (svgTpl.cacheKey) {
      cacheRepository.set(svgTpl.cacheKey, svgData)
    }

    return svgData
  }

  // ======================================================
  // Controller Methods
  // ======================================================
  async function postVolumeChangeTemplate(req, res, next) {
    try {
      const { compiledTpl, svgs} = await templateEngine.compileVolumeChangeTemplate()

      const renderArgs = {
        ...req.body,
        svgs: await Promise.all(svgs.map(makeSvgTplData))
      }

      req.results = templateEngine.renderTemplate(compiledTpl, renderArgs)

      // This is complete test code, remove once finished
      //sendEmailTemplate(results)
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
      folderName: 'KC Devs'
    }

    next()
  }

  // ======================================================
  // Controller Routes
  // ======================================================
  controller.get('/volume-change', generateFakeRequestData, postVolumeChangeTemplate, responseHandler)

  return controller
}

module.exports = APIController
