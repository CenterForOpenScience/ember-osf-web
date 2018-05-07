import { module, skip, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | dashboard', function(hooks) {
    setupTest(hooks);


    skip(() => {
        test('it exists', function(assert) {
            const controller = this.subject();
            // TODO: init calls out requests, need to mock them to have this pass
            assert.ok(controller);
        });
    });
});
