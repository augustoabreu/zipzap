module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    folders: {
      scripts: 'dist/scripts',
      styles: 'dist/styles'
    },

    jshint: {
      options: {
        globals: {
          'window': true,
          'document': true,
          'module': true,
          'zipzap': true,
          'require': true,
          'localStorage': true
        },
        expr: true
      },
      all: 'src/js/*.js'
    },

    clean: {
      js: ['<%= folders.scripts %>/*.js'],
      css: ['<%= folders.styles %>/*.css']
    },

    browserify: {
      dist: {
        files: {
          '<%= folders.scripts %>/main.js': 'src/js/load.js'
        }
      }
    },

    stylus: {
      compile: {
        options: {
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        files: {
          '<%= folders.styles %>/style.css': 'src/css/style.styl'
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: '<%= folders.scripts %>/main.js',
        dest: '<%= folders.scripts %>/main.min.js'
      }
    },

    cssmin: {
      build: {
        files: {
          '<%= folders.styles %>/style.min.css': '<%= folders.styles %>/style.css'
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
          livereload: 35729
        }
      }
    },

    connect: {
      options: {
        port: 9009,
        hostname: '0.0.0.0',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: 'dist'
        }
      }
    }
  });

  // Load tasks
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default tasks
  grunt.registerTask('default', ['jshint:all', 'clean:js', 'browserify', 'clean:css', 'stylus', 'uglify', 'cssmin', 'processhtml:dev']);
  grunt.registerTask('production', ['jshint:all', 'clean:js', 'browserify', 'clean:css', 'stylus', 'uglify', 'cssmin', 'processhtml:prod']);
  grunt.registerTask('serve', ['jshint:all', 'clean:js', 'browserify', 'clean:css', 'stylus', 'uglify', 'cssmin', 'processhtml:dev', 'connect:livereload', 'watch']);

};
