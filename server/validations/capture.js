'use strict';

const Joi = require('joi');

module.exports.post = {
  options: {
    allowUnknownBody: false
  },
  body: {
    event: Joi.object({
      type: Joi.string().required(),
      statusCode: Joi.number().required()
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
