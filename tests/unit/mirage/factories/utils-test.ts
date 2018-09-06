import { guid } from 'ember-osf-web/mirage/factories/utils';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Mirage | Factories | Utils | guid generation', hooks => {
    setupTest(hooks);

    test('it can create guids', assert => {
        assert.equal(guid(1, 'node'), 'node1');
        assert.equal(guid(10, 'node'), 'nod10');
        assert.equal(guid(100, 'node'), 'no100');
        assert.equal(guid(1000, 'node'), 'n1000');
        assert.equal(guid(10000, 'node'), '10000');
    });
});
