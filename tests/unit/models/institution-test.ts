import { run } from '@ember/runloop';
import { setupTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { module, test } from 'qunit';

module('Unit | Model | institution', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('institution'));
        assert.ok(!!model);
    });
});
