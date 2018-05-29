import { setupTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { module, test } from 'qunit';

module('Unit | Adapter | user-registration', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        const adapter = this.owner.lookup('adapter:user-registration');
        assert.ok(adapter);
    });
});
