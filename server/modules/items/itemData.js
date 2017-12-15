const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '..', '..', 'data', 'items.json');
const all = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const ITEM_VALUES = {
  common: 5,
  rare: 20,
  epic: 100,
  legendary: 400
};

// add item values
all.map((item) => {
  item.value = ITEM_VALUES[item.rarity];
});

const byRarity = {
  common: all.filter((e) => e.rarity === 'common'),
  rare: all.filter((e) => e.rarity === 'rare'),
  epic: all.filter((e) => e.rarity === 'epic'),
  legendary: all.filter((e) => e.rarity === 'legendary')
};

let byId = {};
_.each(all, (item) => {
  byId[item.id] = item;
});

module.exports.items = {
  all: all,
  byRarity: byRarity,
  byId: byId
};
