import eatArgs from 'ember-osf-web/utils/eat-args';
import { module, test } from 'qunit';

module('Unit | Utility | eat-args', () => {
    test('it works', assert => {
        assert.ok(eatArgs('foo'));
        assert.notOk(eatArgs());
    });
});
