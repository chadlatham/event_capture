'use strict';

const Joi = require('joi');

module.exports.post = {
  options: {
    allowUnknownBody: false
  },
  body: {
    input: Joi.string()
      .label('Input')
      .trim()
      .required()
  }
};
