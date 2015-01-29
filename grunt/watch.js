module.exports = {
  dev: {
    files: ['Gruntfile.js', '!src/**/*.spec.js', 'src/**/*.js', 'src/**/*.html'],
    tasks: ['html2js:dist', 'concat:dist', 'ngAnnotate:dist']
  },
  options: {
    atBegin: true
  }
};