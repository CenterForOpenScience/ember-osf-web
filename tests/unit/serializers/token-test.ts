import { run } from '@ember/runloop';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Serializer | token', hooks => {
    setupTest(hooks);

    // Replace this with your real tests.
    test('it exists', function(assert) {
        const store = this.owner.lookup('service:store');
        const serializer = store.serializerFor('token');

        assert.ok(serializer);
    });

    test('it serializes records', function(assert) {
        const store = this.owner.lookup('service:store');
        const record = run(() => store.createRecord('token', {}));

        const serializedRecord = record.serialize();

        assert.ok(serializedRecord);
    });
});
