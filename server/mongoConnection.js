'use strict';

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

module.exports = dbURLs[environment].connection;
