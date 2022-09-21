import { hasKey } from 'osf-components/helpers/has-key';
import { module, test } from 'qunit';

module('Unit | Helper | has-key', () => {
    test('returns correct boolean value', assert => {
        const object = { itzy: 'hey' };
        const absentKey = 'twice';
        const existingKey = 'itzy';
        assert.equal(hasKey([object, absentKey]), false);
        assert.equal(hasKey([object, existingKey]), true);
    });

    test('returns false when object is null or undefined', assert => {
        // eslint-disable-next-line no-undef-init
        const object = undefined;
        assert.equal(hasKey([null, 'a']), false);
        assert.equal(hasKey([object, 'b']), false);
    });
});
