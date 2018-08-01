import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Component | x-foo', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        const component = this.owner.factoryFor('component:x-foo').create();
        assert.ok(component);
    });
});
