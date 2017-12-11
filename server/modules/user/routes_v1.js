const assert = require('assert');
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '..', '..', 'data', 'items.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const items = {
  common: data.filter((e) => e.rarity === 'common'),
  rare: data.filter((e) => e.rarity === 'rare'),
  epic: data.filter((e) => e.rarity === 'epic'),
  legendary: data.filter((e) => e.rarity === 'legendary')
};

const ITEM_DROP_RATES = {
  common: 72.00,
  rare: 22.00,
  epic: 5.00,
  legendary: 1.00
};
const sumValues = obj => Object.values(obj).reduce((a, b) => a + b);
assert(sumValues(ITEM_DROP_RATES)-100 < Number.EPSILON);

function rollForRarity(minTier) {
  const roll = 100*Math.random();
  console.log('rarity roll:'+ roll);
  if (roll < ITEM_DROP_RATES.legendary || minTier === 'legendary') return 'legendary';
  else if (roll < ITEM_DROP_RATES.epic || minTier === 'epic') return 'epic';
  else if (roll < ITEM_DROP_RATES.rare || minTier === 'rare') return 'rare';
  else return 'common';
}

function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

function home(req, res) {
  const resObj = {
    msg: 'hello world, try "/api/v1/roll or /api/v1/open". Add ?pretty for formatted JSON output.'
  };
  res.json(resObj);
}

function test(req, res) {
  const testPath = path.join(__dirname, '..', '..', '..', 'login.html');
  console.log(testPath);
  res.sendFile(testPath);
}

function rollForItem(minTier) {
  const rarity = rollForRarity(minTier);
  const itemBucket = items[rarity];
  assert(itemBucket && itemBucket.length > 0, 'no '+rarity+' items found!');
  console.log('roll');
  const indexRoll = randomInt(0, itemBucket.length);
  return itemBucket[indexRoll];
}

async function open(req, res, next) {
  try {
    const items = [rollForItem('rare'), rollForItem(), rollForItem()];
    await req.user.addMultipleItemsToCollection(items);
    res.json(items);
  } catch (e) {
    next(e);
  }
}

function roll(req, res, next) {
  try {
    res.json(rollForItem());
  } catch (e) {
    next(e);
  }
}

function getCollection(req, res, next) {
  try {
    res.json(req.user.item_collection);
  } catch (e) {
    next(e);
  }
}

function getItemData(req, res, next) {
  try {
    res.json(data);
  } catch (e) {
    next(e);
  }
}

function setup(app) {
  app.get('/api/v1/roll', roll);
  app.get('/api/v1/open', open);
  app.get('/api/v1/collection', getCollection);
  app.get('/api/v1/data/items', getItemData);
  app.get('/', home);
  app.get('/test/google-auth', test);

}

module.exports = setup;
