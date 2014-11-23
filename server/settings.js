var path = require('path');
var resolvedPath = path.resolve(__dirname, "../");

module.exports = {
  server: {
    port: 8888
  },
  statics: [
    { name: '/', path: path.join(resolvedPath, '/') },
    { name: '/', path: path.join(resolvedPath, '/bower_components') }
  ]
};