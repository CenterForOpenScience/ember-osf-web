import randomScientist from 'ember-osf-web/utils/random-scientist';
import { module, test } from 'qunit';

module('Unit | Utility | random-scientist', () => {
    test('it works', assert => {
        const result = randomScientist();
        assert.ok(result);
    });
});
