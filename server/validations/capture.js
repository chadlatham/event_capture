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

module.exports.patch = {
  options: {
    allowUnknownBody: false
  },
  body: {
    input: Joi.string()
      .label('Input')
      .trim()
      .optional()
  }
};

module.exports.delete = {
  options: {
    allowUnknownBody: false
  },
  body: {
    input: Joi.string()
      .label('Input')
      .trim()
      .optional()
  }
};
