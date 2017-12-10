// const _ = require('lodash');
const mongoose = require('mongoose');
// const crypto = require('crypto');
// const validator = require('validator');

// function rangeValidator(min, max) {
//   return function(val) {
//     return (min <= val && val <= max);
//   };
// }


// define user schema
var userSchema = mongoose.Schema({
  user_name: {
    type: String,
    unique: true,
    required: true
  },
  google_id: {
    type: String,
    unique: true
  },
  api_key: String,
  item_collection: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});


function addItem(user, item) {
  if (user.item_collection[item.id] === undefined) {
    user.item_collection[item.id] = 0;
  }
  user.item_collection[item.id] +=1;
  user.markModified('item_collection');
}
userSchema.methods.addItemToCollection = function (item) {
  addItem(this, item);
  return this.save();
};

userSchema.methods.addMultipleItemsToCollection = function (items) {
  items.map((item) => {
    addItem(this, item);
  });
  return this.save();
};

// userSchema.methods = {
//   addItemToCollection: addItemToCollection.bind(userSchema),
// };

// userSchema.virtual('password')
//   .set(function (password) {
//     this._password = password;
//     this.salt = this.makeSalt();
//     this.hashed_password = this.hashPassword(password);
//   })
//   .get(function () {
//     return this._password;
//   })
//   ;

// do we need these?
// userSchema.path('email').validate(function (value) {
//   return (typeof value === 'string' && value.length > 0);
// }, 'email cannot be empty');

// userSchema.path('hashed_password').validate(function (value) {
//   return (typeof value === 'string' && value.length > 0);
// }, 'password cannot be empty');

// userSchema.pre('save', function (next) {
//   if (this.isNew && this.password && !this.password.length) {
//     return next(new Error('Invalid Password'));
//   }
//   next();
// });


// userSchema.methods = {
//   authenticate: function (password) {
//     return this.hashPassword(password) === this.hashed_password;
//   },
//   makeSalt: function () {
//     return crypto.randomBytes(16).toString('base64');
//   },
//   hashPassword: function (password) {
//     if (!password || !this.salt) {
//       return '';
//     }

//     var salt = new Buffer(this.salt, 'base64');
//     return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64');
//   }
// };

var User = mongoose.model('User', userSchema);
exports.User = User;
