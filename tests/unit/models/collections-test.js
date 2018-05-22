import { module, test } from 'qunit';
import { setupTest } from 'ember-osf-web/tests/helpers/osf-qunit';

import { run } from '@ember/runloop';

module('Unit | Model | collection', function(hooks) {
    setupTest(hooks);

    test('it exists', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('collection'));
        // let store = this.store();
        assert.ok(!!model);
    });
});
