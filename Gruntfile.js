module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: ['Gruntfile.js', '!app/**/*.spec.js', 'app/**/*.js']
    },

    html2js: {
      options: {
        base: 'app',
        module: 'carnival.templates'
      },
      dist: {
        src: 'app/**/*.html',
        dest: 'dist/tmp/templates.js'
      }
    },

    karma: {
      options: {
        configFile: 'app/karma.conf.js'
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
      options: {
        banner: '/* CARNIVAL.JS */\n(function () {\n"use strict";\n',
        footer: '})();'
      },
      dist: {
        src: ['app/**/*.js',
              '!app/**/*.spec.js',
              '!app/karma.conf.js',
              'dist/tmp/*.js',
              'bower_components/angular-ui-router/release/angular-ui-router.js',
              'bower_components/angular-loading-bar/build/loading-bar.js'
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
    },

    watch: {
      dev: {
        files: ['Gruntfile.js', '!app/**/*.spec.js', 'app/**/*.js', 'app/**/*.html'],
        tasks: ['html2js:dist', 'concat:dist', 'clean:tmp']
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
      options: {
        // Task-specific options go here.
      },
      dist: {
        files: {
          'dist/carnival.js': ['dist/carnival.js']
        }
      },
    },

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

  grunt.registerTask('dev', ['connect', 'watch:dev']);
  grunt.registerTask('test', ['jshint', 'html2js:dist', 'concat:dist', 'clean:tmp', 'karma:unit']);
  grunt.registerTask('test:watch', ['jshint', 'html2js:dist', 'concat:dist', 'clean:tmp', 'karma:continuous']);
  grunt.registerTask('build', ['jshint', 'html2js:dist', 'concat:dist', 'ngAnnotate:dist', 'clean:tmp', 'karma:unit', 'uglify:dist']);

};
