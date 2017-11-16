const _ = require('lodash')
const fs = require('fs');

process.env.NODE_ENV = ~fs.readdirSync('./server/config/env').map(function(file) {
    return file.slice(0, -3);
}).indexOf(process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';

module.exports = _.extend(
    require('./env/all'),
    require('./env/' + process.env.NODE_ENV) || {}
);
