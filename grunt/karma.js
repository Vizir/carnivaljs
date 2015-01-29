module.exports = {
  options: {
    configFile: 'src/karma.conf.js'
  },
  unit: {
    singleRun: true
  },
  continuous: {
    singleRun: false,
    autoWatch: true
  }
};