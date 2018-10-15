import Service from '@ember/service';
import { setupEngineTest } from 'ember-osf-web/tests/helpers/engines';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

const themeStub = Service.extend();

module('Unit | Collections | Route | collections/provider/discover', hooks => {
    setupEngineTest(hooks, 'collections');

    hooks.beforeEach(function(this: TestContext) {
        this.owner.register('service:theme', themeStub);
    });

    test('it exists', function(assert) {
        const route = this.owner.lookup('route:provider/discover');
        assert.ok(route);
    });
});
