
import { getDisplayName } from 'ember-osf-web/helpers/get-display-name';
import { module, test } from 'qunit';

module('Unit | Helper | get display name');

test('username greater than 40 chars', function(assert) {
    const name = Array(50).join('a');
    const result = getDisplayName([name]);
    assert.strictEqual(result, 'aaaaaaaaaaaaaaaaaaaa...aaaaaaaaaaaaaaa');
});

test('username less than 40 chars', function(assert) {
    const name = Array(39).join('a');
    const result = getDisplayName([name]);
    assert.strictEqual(result, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
});
