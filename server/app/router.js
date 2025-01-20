'use strict'


const navApp = require('./routes/nav');
const userApp = require('./routes/user');

const searchApp = require('./routes/search');

module.exports = (app) => {
  navApp(app)
  searchApp(app);
  userApp(app)
}
