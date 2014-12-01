module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: ['Gruntfile.js', 'src/js/*.js', 'src/js/**/*.js']
    },

    html2js: {
      dist: {
        src: ['src/js/templates/*.html'],
        dest: 'dist/tmp/templates.js'
      }
    },

    concat: {
      dist: {
        src: ['src/js/*.js',
              'src/js/**/*.js',
              'dist/tmp/*.js',
              'bower_components/angular-ui-router/release/angular-ui-router.js'
        ],
        dest: 'dist/carnival.js'
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/carnival.min.js': ['dist/carnival.js']
        }
      }
    },

    clean: {
      tmp: {
        src: ['dist/tmp']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html2js');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('build', ['jshint', 'html2js:dist', 'concat:dist', 'uglify:dist', 'clean:tmp']);

};