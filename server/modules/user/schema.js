const mongoose = require('mongoose');
const validator = require('validator');
const Promise = require('bluebird');
const HttpError = require('standard-http-error');
const itemData = require('../items/itemData').items;

const STARTING_MANA = 30;
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
  item_collection: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  max_mana: {
    type: Number,
    default: STARTING_MANA
  },
  mana: {
    type: Number,
    default: STARTING_MANA
  },
  stats: {
    collection_score: {
      type: Number,
      default: 0
    }
  }
});

/// ADD MANA RESOURCE AND RECHARGE (use npm cron?)
/// ADD MANA USAGE TO OPEN
// cron job solution takes 45 secs to update 50K doc
// NEW method should take a few seconds... IMPLEMENT THAT NOW

/// NEXT STEP: leaderboard which requires concept score?
// HS dusting costs
// common = 5
// rare = 20
// epic 100
// leg = 400
// next step**: add roll modifers (like pity timer)


function addItem(user, item) {
  if (user.item_collection[item.id] === undefined) {
    user.item_collection[item.id] = 0;
  }
  user.item_collection[item.id] +=1;
  user.markModified('item_collection');
}

function updateCollectionScore(user) {
  let newTotal = 0;
  Object.keys(user.item_collection).forEach((itemId) => {
    // value * count
    newTotal += itemData.byId[itemId].value * user.item_collection[itemId];
  });
  user.stats.collection_score = newTotal;
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

userSchema.methods.addItemsToCollectionAndSpendMana = function (items, manaCost) {
  return new Promise((resolve, reject) => {
    console.log('mana:', this.mana, manaCost);
    if (this.mana < manaCost) reject(new HttpError(402, 'Not enough mana.'));
    else {
      this.mana -= manaCost;
      items.map((item) => {
        addItem(this, item);
      });
      updateCollectionScore(this);
      this.save().then(resolve).catch(reject);
    }
  });
};

userSchema.statics.generateMana = async function () {
  console.log('In generateMana (static)');
  try {
    const pipeline = [
      {
        '$redact': {
          '$cond': [
            {'$gt': ['$max_mana', '$mana']},
            '$$KEEP',
            '$$PRUNE'
          ]
        }
      }
    ];
    const usersNeedingMana = await mongoose.model('User').aggregate(pipeline).exec();
    const ids = usersNeedingMana.map((e) => {
      return e._id;
    });

    const query = {
      _id: {
        $in: ids
      }
    };
    const update = {
      $inc: {
        mana: 1
      }
    };
    const updateRes = await mongoose.model('User').update(query, update, {multi: true}).exec();
    console.log('mana generation: '+updateRes);
  } catch (e) {
    console.log('error in generateMana', e);
  }
};

var User = mongoose.model('User', userSchema);
exports.User = User;
