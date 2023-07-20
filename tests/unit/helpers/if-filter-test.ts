import { ifFilter } from 'ember-osf-web/helpers/if-filter';
import { module, test } from 'qunit';

module('Unit | Helper | if-filter', () => {
    test('provider matches filter', function(assert) {
        const element = 'OSF';
        const filter = ['OSF'];
        const result = ifFilter([element, filter, undefined]);
        assert.true(result);
    });

    test('provider does not match filter', function(assert) {
        const element = 'Cogprints';
        const filter = ['OSF'];
        const result = ifFilter([element, filter, undefined]);
        assert.false(result);
    });
});
