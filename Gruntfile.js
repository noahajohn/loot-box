const paths = {
  js: [
    'server.js',
    'config/*.js',
    'server/modules/**/routes_v1.js',
    'server/modules/**/schema.js'
  ]
};

module.exports = function(grunt) {
  if (process.env.NODE_ENV !== 'production') {
    require('time-grunt')(grunt);
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsResources: [],
    jshint: {
      all: {
        src: paths.js,
        options: {
          jshintrc: '.jshintrc'
        }
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          args: [],
          ignore: ['node_modules/**', '.keys/**'],
          ext: 'js',
          nodeArgs: ['--inspect'],
          delayTime: 1,
          legacyWatch: true,
          env: {
            PORT: require('./server/config/config').port
          },
          cwd: __dirname
        }
      }
    },
    concurrent: {
      tasks: ['nodemon'],
      // tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    }
  });

  //Load all NPM grunt tasks
  require('load-grunt-tasks')(grunt);

  //Default task(s).
  if (process.env.NODE_ENV === 'production') {
    grunt.registerTask('default', ['concurrent']);
  } else {
    grunt.registerTask('default', ['jshint', 'concurrent']);
    // grunt.registerTask('post-install', []);
  }
};
