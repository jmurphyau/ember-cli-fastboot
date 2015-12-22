var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-fs'));

var glob = require('glob');

require('../helpers/log-on-failure');

var acceptance       = require('../helpers/acceptance');
var createApp        = acceptance.createApp;
var copyFixtureFiles = acceptance.copyFixtureFiles;
var runEmberCommand  = acceptance.runEmberCommand;

var appName = 'dummy';

describe('it builds', function() {
  this.timeout(300000);

  before(function() {
    return createApp(appName)
      .then(function() {
        return copyFixtureFiles(appName);
      });
  });

  it("builds into fastboot-dist by default", function() {
    return runEmberCommand('fastboot:build')
      .then(function() {
        expect('fastboot-dist/index.html').to.be.a.file();
        expect('fastboot-dist/assets/dummy.js').to.be.a.file();
        expect('fastboot-dist/assets/vendor.js').to.be.a.file();
        expect('fastboot-dist/index.html').to.have.content.that.match(
          /<!-- EMBER_CLI_FASTBOOT_BODY -->/
        );
      });
  });

  it("produces a production build with --environment=production", function() {
    return runEmberCommand('fastboot:build', '--environment=production')
      .then(function() {
        expect('fastboot-dist/index.html').to.be.a.file();
        expect(find('fastboot-dist/assets/dummy-*.js')).to.be.a.file();
        expect(find('fastboot-dist/assets/dummy-*.js')).to.match(/dummy-\w{32}/, 'file name should contain MD5 fingerprint');

        expect(find('fastboot-dist/assets/vendor-*.js')).to.be.a.file();
        expect(find('fastboot-dist/assets/vendor-*.js')).to.match(/vendor-\w{32}/, 'file name should contain MD5 fingerprint');

        expect('fastboot-dist/index.html').to.have.content.that.match(
          /<!-- EMBER_CLI_FASTBOOT_BODY -->/
        );
      });
  });

});

function find(globPath) {
  var files = glob.sync(globPath);

  expect(files.length).to.equal(1, globPath);

  return files[0];
}
