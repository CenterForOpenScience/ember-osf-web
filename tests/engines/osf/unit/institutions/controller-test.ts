import Service from '@ember/service';
import { setupEngineTest } from 'ember-osf-web/tests/helpers/engines';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

module('Unit | Controller | institutions', hooks => {
    setupEngineTest(hooks, 'osf');

    const analyticsStub = Service.extend();
    const storeStub = Service.extend();

    hooks.beforeEach(function(this: TestContext) {
        this.owner.register('service:analytics', analyticsStub);
        this.owner.register('service:store', storeStub);
    });

    test('it exists', function(assert) {
        const controller = this.owner.lookup('controller:institutions');
        assert.ok(controller);
    });
});
