'use strict';

const isDeveloping = process.env.NODE_ENV !== 'production';

if (isDeveloping) {
  require('dotenv').config({ silent: true });
}

const express = require('express');
const path = require('path');
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

// Serve the static resources (compiled in dist on deploy)
app.use(express.static(path.join(__dirname, 'dist')));

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
  if (err.status) {
    // Joi validation errors
    return res
      .status(err.status)
      .set('Content-Type', 'application/json')
      .send(err);
  }

  if (err.output && err.output.statusCode) {
    // Boom errors
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
