// const HttpError = require("standard-http-error");
const passport  = require('passport');

const BasicStrategy  = require('../lib/passport-http-as').BasicStrategy;
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

const {User} = require('../server/modules/user/schema');


///////// define authentication strategies

passport.use(new BasicStrategy({passwordRequired: false},
  function(userid, password, done) {
    User.findOne({api_key: userid}, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      // if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));



// passport.use(new GoogleStrategy({
//     clientID: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://www.example.com/auth/google/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ google_id: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));

exports.ensureBasicAuth = passport.authenticate('basic', {session: false});
// exports.ensureGoogleAuth = passport.authenticate('google', {session: false});
