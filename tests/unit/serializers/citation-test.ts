import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Serializer | citation', function(hooks) {
    setupTest(hooks);

  // Replace this with your real tests.
    test('it exists', function(assert) {
        const store = this.owner.lookup('service:store');
        const serializer = store.serializerFor('citation');

        assert.ok(serializer);
    });

    test('it serializes records', function(assert) {
        const store = this.owner.lookup('service:store');
        const record = run(() => store.createRecord('citation', {}));

        const serializedRecord = record.serialize();

        assert.ok(serializedRecord);
    });
});
