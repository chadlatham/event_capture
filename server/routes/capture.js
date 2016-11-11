'use strict';

// Utilities
// const { camelizeKeys, decamelizeKeys } = require('humps');
const boom = require('boom'); // Custom error messages
const co = require('co'); // Generator based async flow control
const axios = require('axios'); // Promise based http library

// Validation
const ev = require('express-validation');
const val = require('../validations/capture');

// Express
const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

// Mongo
const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbURL = require('../mongoConnection');
const ObjectID = require('mongodb').ObjectID;

// Mixpanel
const token = process.env.MIX_PROJECT_TOKEN;
const secret = process.env.MIX_API_SECRET;
const mixUrl = 'http://api.mixpanel.com/track/?';

router.get('/capture', co.wrap(function* (req, res, next) {
  try {
    // Connect to mongo
    const db = yield mongoClient.connect(dbURL);

    // Get the collection
    const col = db.collection('events');
    const docs = yield col.find().toArray();

    // Close the connection
    db.close();

    res.send(docs);
  }
  catch (err) {
    next(err);
  }
}));

router.get('/capture/:_id', co.wrap(function* (req, res, next) {
  try {
    const _id = ObjectID.createFromHexString(req.params._id);

    // Connect to mongo
    const db = yield mongoClient.connect(dbURL);

    // Get the collection
    const col = db.collection('events');
    const doc = yield col.findOne({ _id });

    if (!doc) {
      throw boom.notFound();
    }

    // Close the connection
    db.close();

    res.send(doc);
  }
  catch (err) {
    next(err);
  }
}));

router.post('/capture', ev(val.post), co.wrap(function* (req, res, next) {
  const { event } = req.body;

  try {
    // Connect to Mongo
    const db = yield mongoClient.connect(dbURL);

    // Insert a single document
    const result = yield db.collection('events').insertOne(event);

    assert.equal(1, result.insertedCount);

    // Disconnect from Mongo
    db.close();

    // Build Mixpanel event tracking object
    let mixData = {
      event: event.type,
      properties: {
        token,
        statusCode: event.statusCode
      }
    };

    // Convert to JSON
    mixData = JSON.stringify(mixData);

    // Encode to Base64
    mixData = new Buffer(mixData).toString('base64');

    // Decode from Base64 to JSON if needed later
    // const json = new Buffer('Base64 encoded json', 'base64').toString();

    // Send event data to Mixpanel
    const mixResult = yield axios.get(`${mixUrl}data=${mixData}&verbose=1`);

    // Throw 417 error if Mixpanel API responds with an error
    if (mixResult.data.error) {
      throw boom.expectationFailed(mixResult.data.error);
    }

    res.send(result.ops[0]);
  }
  catch (err) {
    next(err);
  }
}));

module.exports = router;
