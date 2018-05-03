import { moduleFor, test } from 'ember-qunit';

moduleFor('validator:mismatch', 'Unit | Validator | mismatch', {
    needs: [
        'service:i18n',
        'validator:messages',
    ],
});

test('it works', function(assert) {
    const validator = this.subject();
    assert.ok(validator);
});
