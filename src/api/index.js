const express                  = require('express')
const alertTemplatesController = require('./controllers/alertTemplatesController')
const templateFilesController  = require('./controllers/templateFilesController')

const config = (api, container) => {
  const templateRouter = express.Router()
  const fileRouter     = express.Router()

  // ======================================================
  // Mount the controllers to base route
  // ======================================================
  templateRouter.use('/alerts', alertTemplatesController.connect(container))
  fileRouter.use('/', templateFilesController.connect(container))

  // ======================================================
  // Mount the router to the app and return app
  // ======================================================
  api.use('/templates', templateRouter)
  api.use('/template_files', fileRouter)

  return api
};

module.exports = config;
