const paths = {
  jsSrcs: [
    'server.js',
    'config/*.js',
    'server/modules/**/routes_v1.js',
    'server/modules/**/schema.js',
    'server/modules/**/test/*.js'
  ]
};

module.exports = function(grunt) {
  if (process.env.NODE_ENV !== 'production') {
    require('time-grunt')(grunt);
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsResources: [],
    shell: {
      command: './node_modules/csvtojson/bin/csvtojson --delimiter="\t" csvs/items.txt > server/data/items.json'
    },
    watch: {
      csvs: {
        files: 'csvs/items.txt',
        tasks: ['shell'],
        options: {
          interrupt: true,
        },
      },
    },
    eslint: {
      options: {
        configFile: '.eslintrc.json',
        // rulePaths: ['conf/rules']
      },
      target: paths.jsSrcs
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
      // tasks: ['nodemon'],
      tasks: ['nodemon', 'watch'],
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
    grunt.registerTask('default', ['eslint', 'shell', 'concurrent']);
    // grunt.registerTask('post-install', []);
  }
};
