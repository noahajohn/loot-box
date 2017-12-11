const mongoose = require('mongoose');
const validator = require('validator');

// define user schema
var userSchema = mongoose.Schema({
  user_name: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      isAsync: false,
      validator: validator.isEmail,
      message: 'invalid email'
    }
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


var User = mongoose.model('User', userSchema);
exports.User = User;
