'use strict';

const Joi = require('joi');

module.exports.post = {
  options: {
    allowUnknownBody: false
  },
  body: {
    migoEvent: Joi.object({
      event: Joi.string().required(),
      properties: Joi.object().optional()
    }).required()
  }
};

// module.exports.patch = {
//   options: {
//     allowUnknownBody: false
//   },
//   body: {
//     event: Joi.object({
//       _id: Joi.string().required(),
//       type: Joi.string().optional(),
//       statusCode: Joi.number().optional()
//     }).required()
//   }
// };

// module.exports.delete = {
//   options: {
//     allowUnknownParams: false
//   },
//   body: {
//     event: Joi.object({
//       _id: Joi.string().required()
//     }).required()
//   }
// };
