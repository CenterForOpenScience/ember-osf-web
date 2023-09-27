'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Mocha = require('mocha'); // eslint-disable-line no-undef

const test = process.argv[2]; // eslint-disable-line no-undef

// Run the mocha test.
const mocha = new Mocha();
mocha.addFile(`node-tests/${test}-test.js`);
// eslint-disable-next-line no-process-exit
mocha.run(failures => process.on('exit', () => process.exit(failures))); // eslint-disable-line no-undef
