const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '..', '..', 'data', 'items.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

function home(req, res) {
  console.log("home");
  const resObj = {
    msg: "hello world, try '/api/v1/roll' or /api/v1/roll?pretty"
  };
  res.json(resObj);
}

function roll(req, res, next) {
  console.log("roll");
  try {
    const indexRoll = randomInt(0, data.length);
    res.json(data[indexRoll]);
  } catch(e) {
    next(e); 
  }
}

function setup(app) {
  app.get('/api/v1/roll', roll);
  app.get('/', home);

}

module.exports = setup;