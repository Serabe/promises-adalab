const concat = require('broccoli-concat');
const esTranspiler = require('broccoli-babel-transpiler');
const funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');
const postCSS = require('broccoli-postcss');
const cssNext = require('postcss-cssnext');
const pkg = require('./package.json');

const appRoot = 'app';

const htmlFiles = funnel(appRoot, {
  files: ['index.html'],
  destDir: '/'
});

const jsFiles = funnel(`${appRoot}/js`, {
  include: ['**/*.js'],
  destDir: '/js'
});

const cssFiles = funnel(`${appRoot}/css`, {
  include: ['**/*.css'],
  destDir: '/css'
});

module.exports = mergeTrees([
  htmlFiles,
  concat(esTranspiler(jsFiles, {
    presets: [
      ['env', {
        targets: {
          browsers: ['last 2 Chrome versions', 'last 2 Firefox versions']
        }
      }]
    ],
    plugins: [
      'babel-plugin-transform-es2015-modules-amd'
    ],

    moduleIds: true,

    getModuleId(name) {
      name = pkg.name + '/' + name.substr(3);
      return name.replace(/\/index$/, '');
    },

    resolveModuleSource(source, filename) {
      let match = filename.match(/(.+)\/index\.\S+$/i);

      if (match) {
        let { 1: path } = match;
        return source
          .replace(/^\.\//, path + '/')
          .replace(/^\.\.\//, '');
      } else {
        return source;
      }
    }
  }), { outputFile: '/app.js' }),
  postCSS(`${appRoot}/css`, {
    plugins: [
      {
        module: cssNext,
        options: {
          browsers: ['last 2 versions']
        }
      }
    ],
    map: false,
    include: ['**/*.css']
  })
]);

