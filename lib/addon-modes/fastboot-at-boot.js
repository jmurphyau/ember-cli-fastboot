var _                  = require('lodash');
var writeFile          = require('broccoli-file-creator');
var filterInitializers = require('../broccoli/filter-initializers');

var FastBootConfig     = require('../models/fastboot-config');
var FastBootMode       = require('./fastboot');

var FastBootAtBootMode = {
  treeForApp: function(tree) {
    return filterInitializers(tree, 'server');
  },

  contentFor: function(type, config) {

    if (type === 'head') {
      return "<!-- EMBER_CLI_FASTBOOT_TITLE -->";
    }

    if (type === 'body') {
      return "<!-- EMBER_CLI_FASTBOOT_BODY -->";
    }

  },

  treeForFastBootConfig: function() {
    var config = new FastBootConfig({
      project: this.project,
      outputPaths: this.outputPaths,
      ui: this.ui,
      fastBootAtBoot: true
    });
    return writeFile('package.json', config.toJSONString());
  }

};

FastBootAtBootMode = _.extend(FastBootMode, FastBootAtBootMode);

module.exports = FastBootAtBootMode;
