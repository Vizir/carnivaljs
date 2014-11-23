module.exports = function (grunt) {

  grunt.initConfig({

    requirejs: {
      compile: {
        options: {
          baseUrl: './src/js',
          mainConfigFile: './src/js/carnival.js',
          include: ['carnival'],
          name: './bower_components/almond/almond.js',
          out: './dist/carnival.js',
          optimize: 'none',
          preserveLicenseComments: false,
          findNestedDependencies: true,
          generateSourceMaps: false,
          skipDirOptimize: true,
          removeCombined: true,
          wrap: {
            startFile: './grunt/start.frag',
            endFile: './grunt/end.frag'
          }
        }
      }
    },

    uglify: {
      carnival: {
        options: {
          sourceMap: true,
          sourceMapname: './dist/carnival.map'
        },
        files: {
          './dist/carnival.min.js': ['./dist/carnival.js']
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('build', ['requirejs', 'uglify']);

};