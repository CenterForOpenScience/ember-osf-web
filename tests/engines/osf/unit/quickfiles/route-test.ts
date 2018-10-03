import Service from '@ember/service';
import { setupEngineTest } from 'ember-osf-web/tests/helpers/engines';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

const currentUserStub = Service.extend();
const sessionStub = Service.extend();

module('Unit | Route | quickfiles', hooks => {
    setupEngineTest(hooks, 'osf');

    hooks.beforeEach(function(this: TestContext) {
        this.owner.register('service:currentUser', currentUserStub);
        this.owner.register('service:session', sessionStub);
    });

    test('it exists', function(assert) {
        const route = this.owner.lookup('route:quickfiles');
        assert.ok(route);
    });
});
