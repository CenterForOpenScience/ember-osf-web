const { assert } = require('chai');
const { describe, it } = require('mocha');

const checkConfigTypes = require('./helpers/check-config-types');

const environments = ['development', 'test', 'production'];

describe('config', () => {
    describe('type declarations are compatible for each environment', () => {
        environments.forEach(environment => it(environment, () => {
            const { status, stdout } = checkConfigTypes(environment);
            assert.isOk(!status, stdout);
        }).timeout(15000));
    });
});
