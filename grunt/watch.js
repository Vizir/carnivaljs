module.exports = {
  dev: {
    files: ['Gruntfile.js', '!src/**/*.spec.js', 'src/**/*.js','src/**/*.css', 'src/**/*.html'],
    tasks: ['html2js:dist', 'concat:dist', 'concat:css', 'ngAnnotate:dist', 'clean:tmp']
  },
  options: {
    atBegin: true
  }
};
