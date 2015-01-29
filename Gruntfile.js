var configs = require('./grunt');

module.exports = function (grunt) {

  grunt.initConfig({
    pkg:        grunt.file.readJSON('package.json'),
    jshint:     configs.jshint,
    html2js:    configs.html2js,
    karma:      configs.karma,
    concat:     configs.concat,
    uglify:     configs.uglify,
    clean:      configs.clean,
    watch:      configs.watch,
    connect:    configs.connect,
    ngAnnotate: configs.ngAnnotate,
    cssmin:     configs.cssmin
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('start',       ['concat:dist', 'concat:css', 'ngAnnotate:dist', 'clean:tmp', 'html2js:dist', 'connect:keep']);
  grunt.registerTask('start:watch', ['connect:server', 'watch:dev']);
  grunt.registerTask('test',        ['jshint', 'html2js:dist', 'karma:unit', 'clean:tmp']);
  grunt.registerTask('build',       ['jshint', 'html2js:dist', 'concat:dist', 'concat:css', 'ngAnnotate:dist', 'karma:unit', 'uglify:dist', 'cssmin', 'clean:tmp']);

};
