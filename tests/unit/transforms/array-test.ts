import { setupTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { module, test } from 'qunit';

module('Unit | Transform | array', hooks => {
    setupTest(hooks);

    // Replace this with your real tests.
    test('it exists', function(assert) {
        const transform = this.owner.lookup('transform:array');
        assert.ok(transform);
    });
});
