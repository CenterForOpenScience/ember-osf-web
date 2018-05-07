import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { run } from '@ember/runloop';

module('Unit | Model | node', function(hooks) {
    setupTest(hooks);

    test('it exists', function (assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('node'));
        // let store = this.store();
        assert.ok(!!model);
    });
});
