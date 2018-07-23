const express = require('express');
const noteRoutes = require('../../note/note.route');
const authRoutes = require('../../auth/auth.route');
const statusMonitor = require('express-status-monitor')({ path: '' });
const auth = require('http-auth');
const {
  authUser,
  authPassword,
} = require('../../../config/vars');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

const basic = auth.basic({ realm: 'Monitor Area' }, (user, pass, callback) => {
  callback(user === authUser && pass === authPassword);
});
router.use(statusMonitor.middleware);
router.get('/status', auth.connect(basic), statusMonitor.pageRoute);

// server.use(expressStatusMonitor());

/**
 * GET v1/docs
 */
// router.use('/docs', express.static('docs'));

router.use('/notes', noteRoutes);
router.use('/auth', authRoutes);

module.exports = router;
