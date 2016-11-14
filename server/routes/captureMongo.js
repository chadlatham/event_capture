'use strict';

// Utilities
const boom = require('boom'); // Custom error messages
const co = require('co'); // Generator based async flow control
const axios = require('axios'); // Promise based http library
const assert = require('assert'); // Node assertion library

// Validation
const ev = require('express-validation');
const val = require('../validations/capture');

// Router
const router = require('express').Router(); // eslint-disable-line

// Mongo
const ObjectID = require('mongodb').ObjectID;

// Mixpanel
const token = process.env.MIX_PROJECT_TOKEN;
const mixUrl = 'https://api.mixpanel.com/track/?';

// Route will ultimately not be necessary in my opinion.
router.get('/captureMongo', co.wrap(function* (req, res, next) {
  // Reference the db connection pool
  const db = req.app.locals.db;

  try {
    // Get the collection
    const col = db.collection('events');

    // Get all documents
    const docs = yield col.find().toArray();

    res.send(docs);
  }
  catch (err) {
    next(err);
  }
}));

router.get('/captureMongo/:_id', co.wrap(function* (req, res, next) {
  // Reference the db connection pool
  const db = req.app.locals.db;

  // Parse the _id string into a Mongo ObjectID
  const _id = new ObjectID(req.params._id);

  try {
    // Get the collection
    const col = db.collection('events');

    // Find the document with _id
    const doc = yield col.findOne({ _id });

    // If no document, then throw error
    if (!doc) {
      throw boom.notFound();
    }

    res.send(doc);
  }
  catch (err) {
    next(err);
  }
}));

router.post('/captureMongo', ev(val.post), co.wrap(function* (req, res, next) {
  // Reference the db connection pool
  const db = req.app.locals.db;

  // Reference the event from the body
  const { migoEvent } = req.body;

  try {
    // Insert the event into the Mongo DB
    const result = yield db.collection('events').insertOne(migoEvent);

    // Assert that the event was inserted
    assert.equal(1, result.insertedCount);

    // Reference the recorded event from the result
    const newEvent = result.ops[0];

    // Build Mixpanel event tracking object
    let mix = {
      event: migoEvent.event,
      properties: {
        token
      }
    };

    // Combine the properties of the event to the mixData.properties object
    if (newEvent.properties) {
      mix.properties = Object.assign({}, newEvent.properties, mix.properties);
    }

    // Convert to JSON
    mix = JSON.stringify(mix);

    // Encode to Base64
    mix = new Buffer(mix).toString('base64');

    // Send event data to Mixpanel
    const mixResult = yield axios.get(`${mixUrl}data=${mix}&verbose=1`);

    // Throw 417 error if Mixpanel API responds with an error
    if (mixResult.data.error) {
      throw boom.expectationFailed(mixResult.data.error);
    }

    res.send(newEvent);
  }
  catch (err) {
    next(err);
  }
}));

module.exports = router;
