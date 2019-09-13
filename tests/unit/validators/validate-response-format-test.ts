import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { validateResponseFormat } from 'ember-osf-web/validators/validate-response-format';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Validator | validate-response-format', hooks => {
    setupTest(hooks);
    setupMirage(hooks);

    test('validates contributor response format', assert => {
        const options = { format: 'contributor' };
        const validator = validateResponseFormat(options);
        const currentUser = server.create('user', 'loggedIn');
        assert.ok(validator(currentUser), 'returns true for valid contributor');
        assert.equal(validator({ break: 'bang!' }), 'Not a valid contributor',
            'returns error message for invalid contributor');
    });

    test('validates file response format', assert => {
        const options = { format: 'file' };
        const validator = validateResponseFormat(options);
        const currentUser = server.create('user', 'loggedIn');
        const fileOne = server.create('file', {
            name: 'testFile.txt',
            user: currentUser,
        });
        assert.ok(validator(fileOne), 'returns true for valid contributor');
        assert.equal(validator({ break: 'bang!' }), 'Not a valid file',
            'returns error message for invalid file');
    });
});
