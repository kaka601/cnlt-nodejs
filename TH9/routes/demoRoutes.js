const express = require('express');
const router = express.Router();
const demoController = require('../controllers/demoController');

router.get('/heavy-sync', demoController.heavySync);
router.get('/heavy-async', demoController.heavyAsync);

module.exports = router;
