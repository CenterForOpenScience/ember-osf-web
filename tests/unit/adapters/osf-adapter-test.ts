import { run } from '@ember/runloop';
import DS from 'ember-data';
import FactoryGuy, { manualSetup } from 'ember-data-factory-guy';
import Node from 'ember-osf-web/models/node';
import { setupTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import { TestContext } from 'ember-test-helpers';
import { module, skip } from 'qunit';
import { Promise as EmberPromise } from 'rsvp';

module('Unit | Adapter | osf-adapter', hooks => {
    setupTest(hooks);

    hooks.beforeEach(function(this: TestContext) {
        manualSetup(this);
    });

    test('#buildURL appends a trailing slash if missing', function(assert) {
        const url = 'http://localhost:8000/v2/users/me';
        this.stub(DS.JSONAPIAdapter.prototype, 'buildURL').callsFake(() => url);
        const adapter = this.owner.lookup('adapter:osf-adapter');
        const user = FactoryGuy.make('user');
        const result = adapter.buildURL(
            'user',
            'me',
            user._internalModel.createSnapshot(),
            'findRecord',
        );
        assert.notEqual(url, result);
        assert.equal(result.slice(-1), '/');
    });

    test('#buildURL _only_ appends a trailing slash if missing', function(assert) {
        const url = 'http://localhost:8000/v2/users/me/';
        this.stub(DS.JSONAPIAdapter.prototype, 'buildURL').callsFake(() => url);
        const adapter = this.owner.lookup('adapter:osf-adapter');
        const user = FactoryGuy.make('user');
        const result = adapter.buildURL(
            'user',
            'me',
            user._internalModel.createSnapshot(),
            'findRecord',
        );
        assert.equal(url, result);
    });

    test('#buildURL uses relationship links if available for delete, update, and find', function(assert) {
        const url = 'http://localhost:8000/v2/users/me/rel/';
        const adapter = this.owner.lookup('adapter:osf-adapter');
        const user = FactoryGuy.make('user');
        user.set('links', { self: url });

        ['delete', 'update', 'find'].forEach(verb => {
            const result = adapter.buildURL(
                'user',
                'me',
                user._internalModel.createSnapshot(),
                `${verb}Record`,
            );
            assert.equal(url, result);
        });
    });

    test('#buildURL uses snapshot.adapterOptions.url if available', function(assert) {
        const url = 'http://localhost:8000/v2/users/me/rel/';
        const adapter = this.owner.lookup('adapter:osf-adapter');
        const user = FactoryGuy.make('user');
        user.set('links', null);

        const result = adapter.buildURL(
            'user',
            'me',
            user._internalModel.createSnapshot({
                adapterOptions: {
                    url,
                },
            }),
            'createRecord',
        );
        assert.equal(url, result);
    });

    test('#ajaxOptions adds bulk contentType if request is bulk', function(assert) {
        const adapter = this.owner.lookup('adapter:osf-adapter');
        const opts = adapter.ajaxOptions(null, null, {
            isBulk: true,
        });
        assert.equal(opts.contentType, 'application/vnd.api+json; ext=bulk');
    });

    skip('#findRecord can embed(via include) data with findRecord', function(assert) {
        const done = assert.async();
        assert.expect(1);

        run(() => {
            this.inject.service('store');
            const { store } = this;

            const node: Node = FactoryGuy.make('node');
            let children: Node[];

            return EmberPromise
                .all([
                    store.createRecord('node', {
                        title: 'Foo',
                    }),
                    store.createRecord('node', {
                        title: 'Bar',
                    }),
                ])
                .then(res => {
                    children = res;
                    return node.get('children').pushObjects(res);
                })
                .then(() => {
                    node.set('title', 'Parent');
                    return store.findRecord('node', node.id, { include: 'children' });
                })
                .then(res => {
                    assert.equal(
                        res.get('children').toArray()[0].get('title'),
                        children[0].get('title'),
                    );
                })
                .then(done);
        });
    });
});
