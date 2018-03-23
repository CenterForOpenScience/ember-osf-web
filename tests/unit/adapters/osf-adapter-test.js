import { Promise as EmberPromise } from 'rsvp';
import { run } from '@ember/runloop';

import { moduleFor, skip } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import FactoryGuy, { manualSetup } from 'ember-data-factory-guy';

import DS from 'ember-data';

moduleFor('adapter:osf-adapter', 'Unit | Adapter | osf adapter', {
    needs: [
        'model:comment', 'model:contributor', 'model:draft-registration', 'model:file-provider', 'model:citation', 'model:license',
        'model:institution', 'model:log', 'model:node', 'model:node-link', 'model:registration', 'model:user', 'model:preprint', 'model:wiki', 'model:file',
        'adapter:osf-adapter', 'adapter:node', 'adapter:user',
        'serializer:node',
        'service:session',
        'transform:links', 'transform:embed', 'transform:fixstring', 'transform:array', 'transform:object',
    ],
    beforeEach() {
        manualSetup(this.container);
    },
});

test('#buildURL appends a trailing slash if missing', function (assert) {
    const url = 'http://localhost:8000/v2/users/me';
    this.stub(DS.JSONAPIAdapter.prototype, 'buildURL').callsFake(() => url);
    const adapter = this.subject();
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

test('#buildURL _only_ appends a trailing slash if missing', function (assert) {
    const url = 'http://localhost:8000/v2/users/me/';
    this.stub(DS.JSONAPIAdapter.prototype, 'buildURL').callsFake(() => url);
    const adapter = this.subject();
    const user = FactoryGuy.make('user');
    const result = adapter.buildURL(
        'user',
        'me',
        user._internalModel.createSnapshot(),
        'findRecord',
    );
    assert.equal(url, result);
});

test('#buildURL uses relationship links if available for delete, update, and find', function (assert) {
    const url = 'http://localhost:8000/v2/users/me/rel/';
    const adapter = this.subject();
    const user = FactoryGuy.make('user', {
        links: {
            self: url,
        },
    });
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

test('#buildURL uses snapshot.adapterOptions.url if available', function (assert) {
    const url = 'http://localhost:8000/v2/users/me/rel/';
    const adapter = this.subject();
    const user = FactoryGuy.make('user', {
        links: null,
    });

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

test('#buildURL uses snapshot.adapterOptions.url if available', function (assert) {
    const url = 'http://localhost:8000/v2/users/me/rel/';
    const adapter = this.subject();
    const user = FactoryGuy.make('user', {
        links: null,
    });

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

test('#ajaxOptions adds bulk contentType if request is bulk', function (assert) {
    const adapter = this.subject();
    const opts = adapter.ajaxOptions(null, null, {
        isBulk: true,
    });
    assert.equal(opts.contentType, 'application/vnd.api+json; ext=bulk');
});

skip('#findRecord can embed(via include) data with findRecord', function (assert) {
    const done = assert.async();
    assert.expect(1);

    run(() => {
        this.inject.service('store');
        const { store } = this;

        const node = FactoryGuy.make('node');
        let children;

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
