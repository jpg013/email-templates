const express                = require('express')
const alertController        = require('./controllers/alertController')
const fileController         = require('./controllers/fileController')
const apiReferenceController = require('./controllers/apiReferenceController')

const config = (api, container) => {
  const templateRouter     = express.Router()
  const fileRouter         = express.Router()
  const apiReferenceRouter = express.Router()

  // ======================================================
  // Mount the controllers to base route
  // ======================================================
  templateRouter.use('/alerts', alertController.connect(container))
  fileRouter.use('/', fileController.connect(container))
  apiReferenceRouter.use('/', apiReferenceController.connect(container))

  // ======================================================
  // Mount the router to the app and return app
  // ======================================================
  api.use('/templates', templateRouter)
  api.use('/files', fileRouter)
  api.use('/api_reference', apiReferenceRouter)

  return api
};

module.exports = config;
