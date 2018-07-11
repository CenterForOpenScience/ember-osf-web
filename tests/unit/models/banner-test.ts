import { run } from '@ember/runloop';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Model | banner', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('banner'));
        assert.ok(model);
    });
});
