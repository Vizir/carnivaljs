var express = require('express');
var app = express();
var settings = require('./settings');

settings.statics.forEach(function (stat) {
  app.use(stat.name, express.static(stat.path));
});

app.listen(settings.server.port);
console.log('Server running on http://localhost:' + settings.server.port);