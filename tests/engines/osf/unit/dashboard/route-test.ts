import Service from '@ember/service';
import { setupEngineTest } from 'ember-osf-web/tests/helpers/engines';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

const analyticsStub = Service.extend();
const currentUserStub = Service.extend();
const readyStub = Service.extend();
const sessionStub = Service.extend();

module('Unit | Route | dashboard', hooks => {
    setupEngineTest(hooks, 'osf');

    hooks.beforeEach(function(this: TestContext) {
        this.owner.register('service:analytics', analyticsStub);
        this.owner.register('service:currentUser', currentUserStub);
        this.owner.register('service:ready', readyStub);
        this.owner.register('service:session', sessionStub);
    });

    test('it exists', function(assert) {
        const route = this.owner.lookup('route:dashboard');
        assert.ok(route);
    });
});
