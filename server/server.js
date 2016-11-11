'use strict';

const isDeveloping = process.env.NODE_ENV !== 'production';

if (isDeveloping) {
  require('dotenv').config({ silent: true, path: 'server/.env' });
}

const express = require('express');
const port = isDeveloping ? 8000 : process.env.PORT;

// Require Middleware
const morgan = require('morgan');
const bodyParser = require('body-parser');

// Require Client Routes
const capture = require('./routes/capture');

// Instantiate Express
const app = express();

// Disable server identifying header
app.disable('x-powered-by');

// Use Middleware
switch (app.get('env')) {
  case 'development':
    app.use(morgan('dev'));
    break;

  case 'production':
    app.use(morgan('short'));
    break;

  default:
}

app.use(bodyParser.json());

// CSRF protection (only JSON Accept headers to API routes)
app.use('/api', (req, res, next) => {
  if (/json/.test(req.get('Accept'))) {
    return next();
  }

  res.sendStatus(406);
});

// Client routes
app.use('/api', capture);

// Global not found route
app.use((_req, res) => {
  res.sendStatus(404);
});

// Global error handler
// eslint-disable-next-line max-params
app.use((err, _req, res, _next) => {
  // Joi validation errors
  if (err.status) {
    return res
      .status(err.status)
      .set('Content-Type', 'application/json')
      .send(err);
  }

  // Boom errors
  if (err.output && err.output.statusCode) {
    return res
      .status(err.output.statusCode)
      .set('Content-Type', 'text/plain')
      .send(err.message);
  }

  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.sendStatus(500);
});

app.listen(port, () => {
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.log('Listening on port', port);
  }
});
