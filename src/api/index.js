const express                = require('express')
const renderAlertsController = require('./controllers/renderAlertsController')
const downloadController     = require('./controllers/downloadController')
const apiReferenceController = require('./controllers/apiReferenceController')

const config = (api, container) => {
  const renderRouter       = express.Router()
  const downloadRouter     = express.Router()
  const apiReferenceRouter = express.Router()

  // ======================================================
  // Mount the controllers to base route
  // ======================================================
  renderRouter.use('/alerts', renderAlertsController.connect(container))
  downloadRouter.use('/', downloadController.connect(container))
  apiReferenceRouter.use('/', apiReferenceController.connect(container))

  // ======================================================
  // Mount the router to the app and return app
  // ======================================================
  api.use('/render_template', renderRouter)
  api.use('/download_attachment', downloadRouter)
  api.use('/api_reference', apiReferenceRouter)

  return api
};

module.exports = config;
