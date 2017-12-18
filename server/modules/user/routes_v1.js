const path = require('path');
//const {User} = require('./schema');

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

function getCollection(req, res, next) {
  try {
    res.json(req.user.item_collection);
  } catch (e) {
    next(e);
  }
}

function setup(app) {
  app.get('/api/v1/collection', getCollection);
  app.get('/', home);
  app.get('/test/google-auth', test);
}

module.exports = setup;
