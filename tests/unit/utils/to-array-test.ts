import toArray from 'ember-osf-web/utils/to-array';
import { module, test } from 'qunit';

module('Unit | Utility | to-array', () => {
    test('arrays remain arrays', function(assert) {
        const someArray = ['foo'];
        assert.strictEqual(toArray(someArray), someArray);
    });

    test('scalars become arrays', function(assert) {
        const someScalar = 'foo';
        assert.deepEqual(toArray(someScalar), [someScalar]);
    });
});
