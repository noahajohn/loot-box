'use strict';

const path = require('path');
const rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
  root: rootPath,
  port: process.env.PORT || 3000,
  hostname: process.env.HOST || process.env.HOSTNAME,
  app: {
    name: 'Loot Box API'
  }
};
