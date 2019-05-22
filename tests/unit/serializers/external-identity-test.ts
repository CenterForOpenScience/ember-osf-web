import { run } from '@ember/runloop';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Serializer | external-identity', hooks => {
    setupTest(hooks);

    test('it serializes records', function(assert) {
        const record = run(() => this.owner.lookup('service:store').createRecord('external-identity'));
        const serializedRecord = record.serialize();
        assert.ok(serializedRecord);
    });
});
