'use strict';

// Utilities
// const { camelizeKeys, decamelizeKeys } = require('humps');
// const boom = require('boom');

const environment = process.env.NODE_ENV || 'development';

const dbURLs = {
  development: {
    connection: 'mongodb://localhost/capture_dev'
  },
  test: {
    connection: 'mongodb://localhost/capture_test'
  },
  production: {
    connection: process.env.MONGODB_URI
  }
};

// Validation
const ev = require('express-validation');
const val = require('../validations/capture');

// Express
const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

// Mongo
const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbURL = dbURLs[environment].connection;

// Generator support
const co = require('co');

router.get('/capture', co.wrap(function* (req, res, next) {
  try {
    // Connect to mongo
    const db = yield mongoClient.connect(dbURL);

    // Get the collection
    const col = db.collection('find');

    // Delete all existing documents
    yield col.deleteMany();

    // Insert a single document
    const ret = yield col.insertMany([{ a: 1, b: 1, age: 10 }, { a: 1, c: 1, age: 20 }, { a: 1, d: 1, age: 1 }]);

    assert.equal(3, ret.insertedCount);

    // Manual iteration using ES6 generators !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Get the cursor
    // const cursor = col.find({ a: 1 }).limit(3);
    //
    // // Declare results array
    // const docs = [];
    //
    // // Iterate over the cursor and fill an array
    // while (yield cursor.hasNext()) {
    //   docs.push(yield cursor.next());
    // }

    // Using toArray() to iterate the cursor !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Get first two documents that match the query
    // const docs = yield col.find({ a: 1 }).limit(2).toArray();

    // assert.equal(2, docs.length);

    // Get all documents
    // const docs = yield col.find().toArray();

    // Get all docs that match the query
    // const docs = yield col.find({ a: 1 }).toArray();

    // Get all docs that match, skip, limit, and sorted by age
    const docs = yield col.find({ a: 1 }).limit(2).skip(0).sort({ age: 1 }).toArray();

    // Close the connection
    db.close();

    res.send(docs);
  }
  catch (err) {
    next(err);
  }
}));

router.post('/capture', ev(val.post), co.wrap(function* (req, res, next) {
  try {
    // Connect to the db
    const db = yield mongoClient.connect(dbURL);

    // Insert a single document
    const r1 = yield db.collection('inserts').insertOne({ a: 1 });

    assert.equal(1, r1.insertedCount);

    // Insert multiple documents
    const r2 = yield db.collection('inserts').insertMany([{ a: 2 }, { a: 3 }]);

    assert.equal(2, r2.insertedCount);

    // Close connection
    db.close();
    res.send('3 documents written to mongo');
  }
  catch (err) {
    next(err);
  }
}));

// eslint-disable-next-line
router.patch('/capture', ev(val.patch), co.wrap(function* (req, res, next) {
  try {
    let result;

    // Connect to mongo
    const db = yield mongoClient.connect(dbURL);

    // Delete an existing collection
    result = yield db.listCollections({ name: 'updates' }).toArray();
    if (result.length) {
      yield db.dropCollection('updates');
    }

    // Get the updates collection
    const col = db.collection('updates');

    // Insert three documents
    result = yield col.insertMany([{ a: 1 }, { a: 2 }, { a: 2 }]);
    assert.equal(3, result.insertedCount);

    // Update a single document
    // eslint-disable-next-line
    result = yield col.updateOne({ a: 1 }, { $set: { b: 1 }});
    assert.equal(1, result.matchedCount);
    assert.equal(1, result.modifiedCount);

    // Update multiple documents
    // eslint-disable-next-line
    result = yield col.updateMany({ a: 2 }, { $set: { b: 1 }});
    assert.equal(2, result.matchedCount);
    assert.equal(2, result.modifiedCount);

    // Upsert a single document
    // eslint-disable-next-line
    result = yield col.updateOne({ a: 3 }, { $set: { b: 1 }}, { upsert: true });
    assert.equal(1, result.matchedCount);
    assert.equal(0, result.modifiedCount);
    assert.equal(1, result.upsertedCount);
    db.close();
    res.send('patched successfully');
  }
  catch (err) {
    next(err);
  }
}));

router.delete('/capture', ev(val.delete), co.wrap(function* (req, res, next) {
  let ret;

  try {
    // Connect to mongo
    const db = yield mongoClient.connect(dbURL);

    // Get the removes collection
    const col = db.collection('removes');

    // Delete all existing documents in the collection
    yield col.deleteMany();

    // Insert three documents
    ret = yield col.insertMany([{ a: 1 }, { a: 2 }, { a: 2 }]);
    assert.equal(3, ret.insertedCount);

    // Remove a single document
    ret = yield col.deleteOne({ a: 1 });
    assert.equal(1, ret.deletedCount);

    // Remove multiple documents
    ret = yield col.deleteMany({ a: 2 });
    assert.equal(2, ret.deletedCount);

    // Count all documents in the collection
    const count = yield col.count();

    // Close the mongo connection
    db.close();
    res.send(`delete successful - current collection count: ${count}`);
  }
  catch (err) {
    next(err);
  }
}));

module.exports = router;
