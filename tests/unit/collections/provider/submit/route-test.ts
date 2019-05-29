import Service from '@ember/service';
import { setupEngineTest } from 'ember-osf-web/tests/helpers/engines';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

const currentUserStub = Service.extend();
const sessionStub = Service.extend({
    isAuthenticated: true,
});
const storeStub = Service.extend();
const themeStub = Service.extend();
const headTagsStub = Service.extend();

module('Unit | Route | collections/provider/submit', hooks => {
    setupEngineTest(hooks, 'collections');

    hooks.beforeEach(function(this: TestContext) {
        this.owner.register('service:currentUser', currentUserStub);
        this.owner.register('service:session', sessionStub);
        this.owner.register('service:store', storeStub);
        this.owner.register('service:theme', themeStub);
        this.owner.register('service:head-tags', headTagsStub);
    });

    test('it exists', function(assert) {
        const route = this.owner.lookup('route:provider/submit');
        assert.ok(route);
    });
});
