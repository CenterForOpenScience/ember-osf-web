import Service from '@ember/service';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { TaskInstance } from 'ember-concurrency';
import { setupTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';
import sinon, { SinonSandbox } from 'sinon';

import KeenAdapter from 'ember-osf-web/metrics-adapters/keen';

interface SinonTestContext extends TestContext {
    sandbox: SinonSandbox;
}

module('Unit | Metrics Adapter | keen ', hooks => {
    setupTest(hooks);
    setupMirage(hooks);
    const sandbox = sinon.createSandbox();

    hooks.beforeEach(function(this: SinonTestContext) {
        this.sandbox = sandbox;
    });

    hooks.afterEach(() => {
        sandbox.restore();
    });

    test('it exists', function(this: SinonTestContext, assert) {
        assert.ok(this.owner.lookup('metrics-adapter:keen') instanceof KeenAdapter);
    });

    test('trackPage - public node', async function(this: SinonTestContext, assert) {
        const adapter = this.owner.lookup('metrics-adapter:keen') as KeenAdapter;
        const store = this.owner.lookup('service:store');

        const trackPublic = this.sandbox.stub(adapter, 'trackPublicEvent');
        const trackPrivate = this.sandbox.stub(adapter, 'trackPrivateEvent');
        this.owner.register('service:router', Service.extend({
            currentRouteName: 'foo',
        }));

        const mirageNode = server.create('node', { public: true });
        const node = await store.findRecord('node', mirageNode.id);

        this.sandbox.stub(adapter, 'getCurrentNode').resolves(node);

        await adapter.trackPage({ page: 'Foo', title: 'Bar' });

        assert.ok(trackPublic.calledOnce, 'adapter.trackPublicEvent called once');
        assert.ok(trackPrivate.calledOnce, 'adapter.trackPrivateEvent called once');
    });

    test('trackPage - private node', async function(this: SinonTestContext, assert) {
        const adapter = this.owner.lookup('metrics-adapter:keen') as KeenAdapter;
        const store = this.owner.lookup('service:store');

        const trackPublic = this.sandbox.stub(adapter, 'trackPublicEvent');
        const trackPrivate = this.sandbox.stub(adapter, 'trackPrivateEvent');
        this.owner.register('service:router', Service.extend({
            currentRouteName: 'foo',
        }));

        const mirageNode = server.create('node', { public: false });
        const node = await store.findRecord('node', mirageNode.id);

        this.sandbox.stub(adapter, 'getCurrentNode').resolves(node);

        await adapter.trackPage({ page: 'Foo', title: 'Bar' });

        assert.ok(trackPrivate.calledOnce, 'adapter.trackPrivateEvent called once');
        assert.ok(trackPublic.notCalled, 'adapter.trackPublicEvent not called');
    });

    test('trackPage - no node', async function(this: SinonTestContext, assert) {
        const adapter = this.owner.lookup('metrics-adapter:keen') as KeenAdapter;

        const trackPublic = this.sandbox.stub(adapter, 'trackPublicEvent');
        const trackPrivate = this.sandbox.stub(adapter, 'trackPrivateEvent');
        this.owner.register('service:router', Service.extend({
            currentRouteName: 'foo',
        }));

        this.sandbox.stub(adapter, 'getCurrentNode').resolves(undefined);

        await adapter.trackPage({ page: 'Foo', title: 'Bar' });

        assert.ok(trackPrivate.calledOnce, 'adapter.trackPrivateEvent called once');
        assert.ok(trackPublic.notCalled, 'adapter.trackPublicEvent not called');
    });

    test('getCurrentModelTask - undefined', function(this: SinonTestContext, assert) {
        this.owner.register('route:foo', {}, { instantiate: false });
        this.owner.register('service:router', Service.extend({
            currentRouteName: 'foo',
        }));

        const adapter = this.owner.lookup('metrics-adapter:keen') as KeenAdapter;

        assert.deepEqual(adapter.getCurrentModelTask(), {});
    });

    test('getCurrentModelTask - model', function(this: SinonTestContext, assert) {
        const guid = 'gooid';
        const taskInstance = { isRunning: true } as TaskInstance<unknown>;

        this.owner.register('route:foo', { currentModel: { taskInstance, guid } }, { instantiate: false });
        this.owner.register('route:foo.bar', { currentModel: { taskInstance: undefined } }, { instantiate: false });
        this.owner.register('service:router', Service.extend({
            currentRouteName: 'foo.bar',
        }));

        const adapter = this.owner.lookup('metrics-adapter:keen') as KeenAdapter;

        assert.deepEqual(adapter.getCurrentModelTask(), {guid, taskInstance});
    });
});
