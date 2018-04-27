const { assert } = require('chai');

const checkConfigTypes = require('./helpers/check-config-types');

const environments = ['development', 'test', 'production'];

describe('config', () => {
    describe('type declarations are compatible for each environment', () => {
        environments.forEach(environment => it(environment, () => {
            const { status, stdout } = checkConfigTypes(environment);
            assert.isOk(!status, stdout);
        }).timeout(5000));
    });
});
