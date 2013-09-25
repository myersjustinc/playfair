/*global module:false*/
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */\n\n'
    },
    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      js: {
        src: [
          'src/intro.js',
          'src/PF/defaults.js',
          'src/PF/opts.js',
          'src/PF/utils.js',
          'src/PF/init.js',
          'src/outro.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'src/PF/*.js'
      ],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        loopfunc: true,
        globals: {
          $: false,
          google: false,
          log: false,
          PF: true
        }
      }
    },
    qunit: {
      all: [
        'test/**/*.html'
      ]
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: [
          '<%= concat.js.dest %>'
        ],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    }
  });
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-contrib-concat' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.loadNpmTasks( 'grunt-contrib-qunit' );
  grunt.registerTask( 'default', [ 'jshint', 'concat', 'qunit', 'uglify' ] );
  grunt.registerTask( 'fast', [ 'jshint', 'concat', 'uglify' ] );
};