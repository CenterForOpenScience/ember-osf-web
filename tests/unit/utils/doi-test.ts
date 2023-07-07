import { extractDoi, validateDoi } from 'ember-osf-web/utils/doi';
import { module, test } from 'qunit';

module('Unit | Utility | doi', () => {
    test('doi regex', function(assert) {
        const strs = [
            ['', null, false],
            ['10.12/f2tg', null, false],
            ['10.1121', null, false],
            ['10.1121.12121', null, false],
            ['10.1121/f2kl', '10.1121/f2kl', true],
            ['10.1121/f2kl.qwes', '10.1121/f2kl.qwes', true],
            ['http://dx.doi.org/10.1121/f2kl', '10.1121/f2kl', true],
            ['https://doi.org/10.1121/f2kl', '10.1121/f2kl', true],
        ];

        for (const [actual, expected, valid] of strs) {
            assert.equal(validateDoi(actual as string), valid);
            assert.equal(extractDoi(actual as string), expected);
        }
    });
});
