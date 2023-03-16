import Service from '@ember/service';
import { EnginesTestContext } from 'ember-engines/test-support';
import { setupEngineTest } from 'ember-osf-web/tests/helpers/engines';
import { module, test } from 'qunit';

const headTagsStub = Service.extend({
    collectHeadTags: () => { /* noop */ },
});
const currentUserStub = Service.extend();
const sessionStub = Service.extend({
    isAuthenticated: true,
});
const featuresStub = Service.extend({
    isEnabled: () => false,
});
const storeStub = Service.extend();
const analyticsStub = Service.extend();

module('Registries | Unit | Route | branded', hooks => {
    setupEngineTest(hooks, 'registries');

    hooks.beforeEach(function(this: EnginesTestContext) {
        this.owner.register('service:headTags', headTagsStub);
        this.owner.register('service:currentUser', currentUserStub);
        this.owner.register('service:session', sessionStub);
        this.owner.register('service:store', storeStub);
        this.owner.register('service:analytics', analyticsStub);
        this.owner.register('service:features', featuresStub);
    });

    test('branded.discover exists', function(this: EnginesTestContext, assert) {
        const route = this.engine.lookup('route:branded.discover');
        assert.ok(route);
    });

    test('branded.new exists', function(this: EnginesTestContext, assert) {
        const route = this.engine.lookup('route:branded.new');
        assert.ok(route);
    });
});
