const fs = require('fs-extra');
const path = require('path');

const root = path.resolve();


var err;
err = fs.copySync(root + '/lib/angular-cli/models/webpack-build-typescript.js', root + '/node_modules/angular-cli/models/webpack-build-typescript.js');
if (err) {
  console.error(err);
} else {
  console.log("@ngtools/webpack/src/webpack-build-typescript.js overwrite success.");
}

console.log('\n');
