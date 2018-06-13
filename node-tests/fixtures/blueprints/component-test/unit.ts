import { setupTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { module, test } from 'qunit';

module('Unit | Component | x-foo', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        const component = this.owner.factoryFor('component:x-foo').create();
        assert.ok(component);
    });
});
