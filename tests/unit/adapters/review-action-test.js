import { module, test } from 'qunit';
import { setupTest } from 'ember-osf-web/tests/helpers/osf-qunit';

module('Unit | Adapter | review-action', function(hooks) {
    setupTest(hooks);

    // Replace this with your real tests.
    test('it exists', function(assert) {
        const adapter = this.owner.lookup('adapter:review-action');
        assert.ok(adapter);
    });
});
