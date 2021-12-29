'use strict';

const navApp = require('./routes/nav');
const userApp = require('./routes/user');

module.exports = app => {
  navApp(app);
  userApp(app);
};
