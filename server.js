const enforce = require('express-sslify');
const express = require('express');
const passport = require('passport');
const pretty = require('express-prettify');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const morgan = require('morgan');
const mongoose = require('mongoose');
const pass = require('./config/pass');
// const RateLimit = require('express-rate-limit');
const HttpError = require('standard-http-error');
const app = express();
const isProd = process.env.NODE_ENV === 'production';
// const apiLimiter = new RateLimit({
//   windowMs: 10*1*1000, // 10 seconds
//   max: 150,
//   delayMs: 0, // disabled
//   message: 'Too many requests, please try again later.',
//   headers: true
// });

// connect to db
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/loot-box');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoose error:'));

// Redirect all HTTP traffic to HTTPS in production
if (isProd) {
  app.use(enforce.HTTPS({trustProtoHeader: true}));
}

app.use(passport.initialize());
app.use(methodOverride());
app.use(bodyParser.json({limit: '1mb'}));
app.use(morgan('dev'));


function errorHandler (err, req, res, next) { //eslint-disable-line
  let statusCode = 500;
  if (!isProd) console.log(err);
  switch (err.name) {
    case 'HttpError':
      statusCode = err.code;
      break;
    case 'ValidationError':
    case 'CastError':
      statusCode = 400;
      //It isn't a validation/cast error to user.
      // Let's considerate that this id doesn't exists at all.
      // if (err.type === 'ObjectId' && err.path === '_id') {
      //   err = null;
      //   statusCode = 404;
      // }
      break;
    case 'MongoError':
      //statusCode = getMongoErrorsCode(err.code);
      break;
  }
  res.status(statusCode).json({error: err});
}

// Secure backend api this has to go before declaring routes.

// app.use('/api/*', apiLimiter);

app.all('/api/v1/*', pass.ensureBearerAuth, pretty({query: 'pretty'}), function (req, res, next) {
  next();
});

// app routes
[
  './server/modules/user/routes_v1',
].forEach(function (routePath) {
    require(routePath)(app);
});

app.use('/api/*', function(req, res, next){
  next(new HttpError(404, 'Unrecognized request URL ('+req.method+': '+req.baseUrl+').'));
});

app.use(errorHandler);

app.listen(process.env.PORT || 3000);
