import randomScientist from 'ember-osf-web/utils/random-scientist';
import { module, test } from 'qunit';

module('Unit | Utility | random-scientist', () => {
    test('it works', function(assert) {
        const result = randomScientist();
        assert.ok(result);
    });
});
