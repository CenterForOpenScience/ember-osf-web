import { hasKey } from 'osf-components/helpers/has-key';
import { module, test } from 'qunit';

module('Unit | Helper | has-key', () => {
    test('returns correct boolean value', function(assert) {
        const object = { itzy: 'hey' };
        const absentKey = 'twice';
        const existingKey = 'itzy';
        assert.false(hasKey([object, absentKey]));
        assert.true(hasKey([object, existingKey]));
    });

    test('returns false when object is null or undefined', function(assert) {
        // eslint-disable-next-line no-undef-init
        const object = undefined;
        assert.false(hasKey([null, 'a']));
        assert.false(hasKey([object, 'b']));
    });
});
