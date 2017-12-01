const express                       = require('express')
const httpStatus                    = require('http-status-codes')
const renderAlertTemplateController = require('./controllers/renderAlertTemplateController')
const downloadAttachmentController  = require('./controllers/downloadAttachmentController')
const apiReferenceController        = require('./controllers/apiReferenceController')

// ======================================================
// Error Handling
// ======================================================
const handleErrorResponse = (err, req, res, next) => {
  const { message, status } = err

  if (!message || !status) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({message: 'There was an error processing the request.'})
  }

  res.status(status).send({ message })
}

const config = (api, container) => {
  const renderRouter       = express.Router()
  const downloadRouter     = express.Router()
  const apiReferenceRouter = express.Router()

  // ======================================================
  // Mount the controllers to base route
  // ======================================================
  renderRouter.use('/alerts', renderAlertTemplateController.connect(container))
  downloadRouter.use('/', downloadAttachmentController.connect(container))
  apiReferenceRouter.use('/', apiReferenceController.connect(container))

  // ======================================================
  // Mount the router to the app and return app
  // ======================================================
  api.use('/render_template', renderRouter)
  api.use('/download_attachment', downloadRouter)
  api.use('/api_reference', apiReferenceRouter)
  api.use(handleErrorResponse)

  return api
};

module.exports = config;
