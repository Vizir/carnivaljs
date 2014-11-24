var path = require('path');
var resolvedPath = path.resolve(__dirname, "../");

module.exports = {
  server: {
    port: 3010
  },
  statics: [
    { name: '/', path: path.join(resolvedPath, '/') }
  ]
};