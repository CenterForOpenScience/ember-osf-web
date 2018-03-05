import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('transform:links', 'Unit | Transform | links', function(hooks) {
    setupTest(hooks);

  // Replace this with your real tests.
    test('it exists', function(assert) {
        const transform = this.owner.lookup('transform:links');
        assert.ok(transform);
    });
});
