// const HttpError = require("standard-http-error");
const passport  = require('passport');
const fs = require('fs');
const path = require('path');

const BasicStrategy  = require('../lib/passport-http-as').BasicStrategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

const {User} = require('../server/modules/user/schema');
const devCredFile = path.join(__dirname,'..', '.keys', 'credentials.json');
const CLIENT_ID = process.env.OAUTH_GOOGLE_CLIENT_ID || JSON.parse(fs.readFileSync(devCredFile, 'utf8')).OAUTH_GOOGLE_CLIENT_ID || null; //eslint-disable-line
const GoogleAuth = require('google-auth-library');
const auth = new GoogleAuth;
const client = new auth.OAuth2(CLIENT_ID, '', '');


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

passport.use(new BearerStrategy(
  (token, done) => {
    client.verifyIdToken(token, CLIENT_ID, async (err, login) => {
      if (err) {
        return done(null, false);
      }
      console.log('token verified by google!');
      const payload = login.getPayload();
      const googleId = payload['sub'];
      try {
        let user = await User.findOne({google_id: googleId});
        if (!user) {
          const email = payload['email'];
          user = await User.create({google_id: googleId, user_name: email, email: email});
        }
        return done(null, user, {scope: 'all'});
      } catch (e) {
        return done(e);
      }
    });
  }
));


exports.ensureBasicAuth = passport.authenticate('basic', {session: false});
exports.ensureBearerAuth = passport.authenticate('bearer', {session: false});
