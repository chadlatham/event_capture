'use strict';

// Utilities
const boom = require('boom'); // Custom error messages
const co = require('co'); // Generator based async flow control
const axios = require('axios'); // Promise based http library
const assert = require('assert'); // Node assertion library

// Validation
const ev = require('express-validation');
const val = require('../validations/capture');

// Express
const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

// Mongoose
const dbURL = require('../mongoConnection');
const mongoose = require('mongoose');

// Use ES6 promises with mongoose
mongoose.Promise = global.Promise;

// Mongoose Event schema
const MigoEvent = mongoose.model('MigoEvent', new mongoose.Schema({
  event: String,
  properties: Object
}, { timestamps: true }));

// Mixpanel
const token = process.env.MIX_PROJECT_TOKEN;
const mixUrl = 'https://api.mixpanel.com/track/?';

router.get('/capture', co.wrap(function* (req, res, next) {
  try {
    // Connect mongoose
    yield mongoose.connect(dbURL);

    // Reference the db
    const db = mongoose.connection;

    try {
      const events = yield MigoEvent.find().exec();

      res.send(events);
    }
    finally {
      db.close();
    }
  }
  catch (err) {
    next(err);
  }
}));

router.get('/capture/:id', co.wrap(function* (req, res, next) {
  try {
    const id = req.params.id;

    // Connect mongoose
    yield mongoose.connect(dbURL);

    // Reference the db
    const db = mongoose.connection;

    try {
      const event = yield MigoEvent.findById(id).exec();

      res.send(event);
    }
    catch (err) {
      // Handle id not valid or not found error
      if (err.name === 'CastError') {
        throw boom.notFound(err.message);
      }

      // Pass error to global error handler
      throw err;
    }
    finally {
      db.close();
    }
  }
  catch (err) {
    next(err);
  }
}));

// eslint-disable-next-line
router.post('/capture', ev(val.post), co.wrap(function* (req, res, next) {
  try {
    // Create the event
    const migoEvent = new MigoEvent(req.body.migoEvent);

    // Connect mongoose
    yield mongoose.connect(dbURL);

    // Reference the db
    const db = mongoose.connection;

    try {
      // const result = yield migoEvent.save();

      assert.equal(result.event, migoEvent.event);

      console.log(migoEvent)
      // Build Mixpanel event tracking object
      // let mixData = {
      //   event: migoEvent.event,
      //   properties: {
      //     token,
      //     statusCode: event.statusCode
      //   }
      // };
      //
      // // Convert to JSON
      // mixData = JSON.stringify(mixData);
      //
      // // Encode to Base64
      // mixData = new Buffer(mixData).toString('base64');
      //
      // // Decode from Base64 to JSON if needed later
      // // const json = new Buffer('Base64 encoded json', 'base64').toString();
      //
      // // Send event data to Mixpanel
      // const mixResult = yield axios.get(`${mixUrl}data=${mixData}&verbose=1`);
      //
      // // Throw 417 error if Mixpanel API responds with an error
      // if (mixResult.data.error) {
      //   throw boom.expectationFailed(mixResult.data.error);
      // }

      // res.send(result);
      res.send('success');
    }
    finally {
      db.close();
    }
  }
  catch (err) {
    next(err);
  }
}));

module.exports = router;
