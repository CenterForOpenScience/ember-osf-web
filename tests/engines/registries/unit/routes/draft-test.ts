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
const storeStub = Service.extend();
const analyticsStub = Service.extend();

module('Registries | Unit | Route | drafts.draft', hooks => {
    setupEngineTest(hooks, 'registries');

    hooks.beforeEach(function(this: EnginesTestContext) {
        this.owner.register('service:headTags', headTagsStub);
        this.owner.register('service:currentUser', currentUserStub);
        this.owner.register('service:session', sessionStub);
        this.owner.register('service:store', storeStub);
        this.owner.register('service:analytics', analyticsStub);
    });

    test('drafts index exists', function(this: EnginesTestContext, assert) {
        const route = this.engine.lookup('route:drafts.index');
        assert.ok(route);
    });

    test('drafts.draft.page exists', function(this: EnginesTestContext, assert) {
        const route = this.engine.lookup('route:drafts.draft.page');
        assert.ok(route);
    });

    test('drafts.draft.review exists', function(this: EnginesTestContext, assert) {
        const route = this.engine.lookup('route:drafts.draft.review');
        assert.ok(route);
    });

    test('drafts.draft exists', function(this: EnginesTestContext, assert) {
        const route = this.engine.lookup('route:drafts.draft');
        assert.ok(route);
    });

    test('drafts.draft.metadata exists', function(this: EnginesTestContext, assert) {
        const route = this.engine.lookup('route:drafts.draft.metadata');
        assert.ok(route);
    });
});
