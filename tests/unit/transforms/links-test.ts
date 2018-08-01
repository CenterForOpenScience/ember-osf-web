import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Transform | links', hooks => {
    setupTest(hooks);

    // Replace this with your real tests.
    test('it exists', function(assert) {
        const transform = this.owner.lookup('transform:links');
        assert.ok(transform);
    });
});
