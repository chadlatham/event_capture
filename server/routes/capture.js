'use strict';

const { camelizeKeys, decamelizeKeys } = require('humps');
const boom = require('boom');
const ev = require('express-validation');
const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const val = require('../validations/capture');

router.post('/capture', ev(val.post), (req, res, next) => {
  res.send('post');
});

router.get('/capture', (req, res, next) => {
  res.send('get');
});

module.exports = router;
