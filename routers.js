'use strict';

function route (app) {
  app.use('/api/', require('./api/push'));
}

module.exports = route;