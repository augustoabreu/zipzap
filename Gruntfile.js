module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    folders: {
      scripts: 'dist/scripts/',
      styles: 'dist/styles/'
    },

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
          'src/js/menu.js',
          'src/js/setup.js',
          'src/js/load.js'
        ],
        dest: '<%= folders.scripts %>app.js'
      }
    },

    stylus: {
      compile: {
        options: {
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        files: {
          '<%= folders.styles %>style.css': 'src/css/style.styl'
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: '<%= folders.scripts %>app.js',
        dest: '<%= folders.scripts %>app.min.js'
      }
    },

    cssmin: {
      build: {
        files: {
          '<%= folders.styles %>style.min.css': '<%= folders.styles %>style.css'
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
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default tasks
  grunt.registerTask('default', ['jshint:all', 'concat', 'stylus', 'uglify', 'cssmin', 'processhtml:dev']);
  grunt.registerTask('production', ['jshint:all', 'concat', 'stylus', 'uglify', 'cssmin', 'processhtml:prod']);
  grunt.registerTask('serve', ['jshint:all', 'concat', 'stylus', 'uglify', 'cssmin', 'processhtml:dev', 'connect:livereload', 'watch']);

};
