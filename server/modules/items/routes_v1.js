const itemData = require('../items/itemData').items;
const data = itemData.all;

function getItemData(req, res, next) {
  try {
    res.json(data);
  } catch (e) {
    next(e);
  }
}

function setup(app) {
  app.get('/api/v1/data/items', getItemData);
}

module.exports = setup;
