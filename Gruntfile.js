module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: ['Gruntfile.js', '!src/**/*.spec.js', 'src/**/*.js']
    },

    html2js: {
      options: {
        base: 'src',
        module: 'carnival.templates'
      },
      dist: {
        src: 'src/**/*.html',
        dest: 'dist/tmp/templates.js'
      }
    },

    karma: {
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
    },

    concat: {
      dist: {
        options: {
          banner: '/* CARNIVAL.JS */\n(function () {\n"use strict";\n',
          footer: '})();'
        },
        src: ['src/**/*.js',
              '!src/**/*.spec.js',
              '!src/karma.conf.js',
              'dist/tmp/*.js',
              'bower_components/angular-ui-router/release/angular-ui-router.js',
              'bower_components/textAngular/src/textAngular.js',
              'bower_components/textAngular/src/textAngular-sanitize.js',
              'bower_components/textAngular/src/textAngularSetup.js',
              'bower_components/angular-translate/angular-translate.js',
              'bower_components/angular-datepicker/dist/index.js',
              'bower_components/string-mask/src/string-mask.js'

        ],
        dest: 'build/carnival.js'
      },

      css: {
        src: [
          'styles/carnival.css',
          'bower_components/bootstrap/dist/css/bootstrap.css',
          'bower_components/font-awesome/css/font-awesome.css',
          'bower_components/angular-datepicker/dist/index.css'
        ],
        dest: 'build/carnival.css'
      }
    },

    uglify: {
      dist: {
        files: {
          'build/carnival.min.js': ['build/carnival.js']
        }
      }
    },

    clean: {
      tmp: {
        src: ['dist/tmp']
      }
    },

    watch: {
      dev: {
        files: ['Gruntfile.js', '!src/**/*.spec.js', 'src/**/*.js', 'src/**/*.html'],
        tasks: ['html2js:dist', 'concat:dist', 'ngAnnotate:dist']
      },
      options: {
        atBegin: true
      }
    },

    connect: {
      server: {
        options: {
          hostname: 'localhost',
          port: 3010
        }
      }
    },

    ngAnnotate: {
      dist: {
        files: {
          'build/carnival.js': ['build/carnival.js']
        }
      },
    },

    cssmin: {
      target: {
        files: [{
          'build/carnival.min.css': ['build/carnival.css']
        }]
      }
    }

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

  grunt.registerTask('dev', ['connect', 'watch:dev']);
  grunt.registerTask('test', ['jshint', 'html2js:dist', 'karma:unit', 'clean:tmp']);
  grunt.registerTask('test:watch', ['jshint', 'html2js:dist', 'karma:continuous', 'clean:tmp']);
  grunt.registerTask('build', ['jshint', 'html2js:dist', 'concat:dist', 'concat:css', 'cssmin', 'ngAnnotate:dist', 'karma:unit', 'uglify:dist',  'clean:tmp']);

};
