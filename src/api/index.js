const express                 = require('express')
const alertsController = require('./controllers/alertsController')

const config = (app, container) => {
  const apiRouter = express.Router();

  // ======================================================
  // Mount the controllers to base route
  // ======================================================
  apiRouter.use('/alerts', alertsController.connect(container))

  // ======================================================
  // Mount the router to the app and return app
  // ======================================================
  app.use('/email_templates', apiRouter);
  return app;
};

module.exports = config;
