const assert = require('assert');
const itemData = require('../items/itemData').items;
const items = itemData.byRarity;

const DEFAULT_MANA_COST = 10;
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

function rollForItem(minTier) {
  const rarity = rollForRarity(minTier);
  const itemBucket = items[rarity];
  assert(itemBucket && itemBucket.length > 0, 'no '+rarity+' items found!');
  console.log('roll');
  const indexRoll = randomInt(0, itemBucket.length);
  return itemBucket[indexRoll];
}

async function open(req, res, next) {
  const manaCost = req.query.test !== undefined ? 0 : DEFAULT_MANA_COST;
  try {
    const items = [rollForItem('rare'), rollForItem(), rollForItem()];
    await req.user.addItemsToCollectionAndSpendMana(items, manaCost);
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

function setup(app) {
  app.get('/api/v1/roll', roll);
  app.get('/api/v1/open', open);
}

module.exports = setup;
