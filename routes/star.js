const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const Star = require('../controllers/stars.js')

const router = express.Router();
router.get('/danie', Star.danie);
router.get('/malkova', Star.malkova);
router.get('/mia', Star.mia);
router.get('/sunny', Star.sunny);
router.get('/eva', Star.eva);
router.get('/savita', Star.savita);
router.get('/sasha', Star.sasha);
router.get('/gandibaat', Star.gandibaat);
router.get('/poonam', Star.poonam);
router.get('/mastram', Star.mastram);

module.exports = router;