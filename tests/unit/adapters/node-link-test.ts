import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Adapter | node link', function(hooks) {
    setupTest(hooks);

  // Replace this with your real tests.
    test('it exists', function(assert) {
        const adapter = this.owner.lookup('adapter:node-link');
        assert.ok(adapter);
    });
});
