import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Adapter | file provider', function(hooks) {
    setupTest(hooks);

  // Replace this with your real tests.
    test('it exists', function(assert) {
        const adapter = this.owner.lookup('adapter:file-provider');
        assert.ok(adapter);
    });
});
