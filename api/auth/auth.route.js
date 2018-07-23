const express = require('express');
const controller = require('./auth.controller');

const router = express.Router();


router
  .route('/facebook')
  .post(controller.authenticate);


module.exports = router;
