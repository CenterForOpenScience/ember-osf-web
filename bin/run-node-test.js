'use strict';

const Mocha = require('mocha');

const test = process.argv[2];

// Run the mocha test.
const mocha = new Mocha();
mocha.addFile(`node-tests/${test}-test.js`);
// eslint-disable-next-line no-process-exit
mocha.run(failures => process.on('exit', () => process.exit(failures)));
