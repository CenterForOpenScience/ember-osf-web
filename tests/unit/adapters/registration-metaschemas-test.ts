import { setupTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { module, test } from 'qunit';

module('Unit | Adapter | registration metaschemas', hooks => {
    setupTest(hooks);

    // Replace this with your real tests.
    test('it exists', function(assert) {
        const adapter = this.owner.lookup('adapter:registration-metaschemas');
        assert.ok(adapter);
    });
});
