module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        globals: {
          'zipzap': true
        },
        expr: true
      },
      all: 'src/js/*.js'
    },

    concat: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        src: ['src/js/config.js',
              'src/js/modal.js',
              'src/js/app.js',
              'src/js/setup.js',
              'src/js/load.js'],
        dest: 'dist/scripts/app.js'
      }
    },

    stylus: {
      compile: {
        options: {
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        files: {
          'dist/styles/style.css': 'src/css/style.styl'
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'dist/scripts/app.js',
        dest: 'dist/scripts/app.min.js'
      }
    },

    cssmin: {
      build: {
        files: {
          'dist/styles/style.min.css': 'dist/styles/style.css'
        }
      }
    },

    processhtml: {
      dev: {
        files: {
          'dist/index.html': ['src/index.html']
        }
      },
      prod: {
        files: {
          'dist/index.html': ['src/index.html']
        }
      }
    },

    watch: {
      scripts: {
        files: ['Gruntfile.js', 'src/js/*.js', 'src/css/*.styl', 'src/*.html'],
        tasks: ['jshint:all', 'concat', 'stylus', 'uglify', 'cssmin', 'processhtml:dev'],
        options: {
          livereload: true
        }
      }
    }

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['jshint:all', 'concat', 'stylus', 'uglify', 'cssmin', 'processhtml:dev']);
  grunt.registerTask('production', ['jshint:all', 'concat','stylus', 'uglify', 'cssmin', 'processhtml:prod']);

};
