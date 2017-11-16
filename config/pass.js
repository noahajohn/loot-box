// const HttpError = require("standard-http-error");
const passport  = require('passport');

const BasicStrategy  = require('../lib/passport-http-as').BasicStrategy;

const { User }  = require('../server/modules/user/schema');


///////// define authentication strategies

passport.use(new BasicStrategy({passwordRequired: false},
  function(userid, password, done) {
    User.findOne({ api_key: userid }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      // if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));

exports.ensureBasicAuth = passport.authenticate('basic', { session: false });