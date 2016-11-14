'use strict';

const environment = process.env.NODE_ENV || 'development';

const dbURLs = {
  development: {
    connection: 'mongodb://localhost/capture_dev?maxPoolSize=5'
  },
  test: {
    connection: 'mongodb://localhost/capture_test?maxPoolSize=5'
  },
  production: {
    connection: process.env.MONGODB_URI
  }
};

module.exports = dbURLs[environment].connection;
