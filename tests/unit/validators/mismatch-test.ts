import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Validator | mismatch', hooks => {
    setupTest(hooks);

    test('it works', function(assert) {
        const validator = this.owner.lookup('validator:mismatch');
        assert.ok(validator);
    });
});
