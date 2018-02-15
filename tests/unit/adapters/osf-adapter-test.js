
import { resolve, Promise as EmberPromise } from 'rsvp';
import { run, begin, end } from '@ember/runloop';

import { moduleFor, skip } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import FactoryGuy, { manualSetup } from 'ember-data-factory-guy';

import DS from 'ember-data';
import JSONAPIAdapter from 'ember-data/adapters/json-api';

import OsfAdapter from 'ember-osf-web/adapters/osf-adapter';

moduleFor('adapter:osf-adapter', 'Unit | Adapter | osf adapter', {
    needs: [
        'model:comment', 'model:contributor', 'model:draft-registration', 'model:file-provider', 'model:citation', 'model:license',
        'model:institution', 'model:log', 'model:node', 'model:node-link', 'model:registration', 'model:user', 'model:preprint', 'model:wiki',
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
    ['delete', 'update', 'find'].forEach((verb) => {
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

test('#_buildRelationshipURL uses relationshipLinks', function (assert) {
    const url = 'http://localhost:8000/v2/users/me/foo-bar-baz/';
    const adapter = this.subject();
    const user = FactoryGuy.make('user', {
        links: {
            relationships: {
                nodes: {
                    links: {
                        related: {
                            href: url,
                        },
                    },
                },
            },
        },
    });

    const result = adapter._buildRelationshipURL(
        user._internalModel.createSnapshot({
            adapterOptions: {
                url,
            },
        }),
        'nodes',
    );
    assert.equal(url, result);
});

test('#_createRelated maps over each createdSnapshots and adds records to the parent\'s canonical state', function (assert) {
    assert.expect(5);
    this.inject.service('store');
    const { store } = this;

    const node = FactoryGuy.make('node');
    let contributors;
    run(() => {
        contributors = [
            store.createRecord('contributor', {
                title: 'Foo',
            }),
            store.createRecord('contributor', {
                title: 'Bar',
            }),
        ];
    });
    node.get('contributors').pushObjects(contributors);
    const saveStubs = contributors.map(c => this.stub(c, 'save', () => {
        return resolve();
    }));

    const addCanonicalStub = this.stub();
    this.stub(node, 'resolveRelationship').callsFake(() => {
        return {
            addCanonicalRecord: addCanonicalStub,
        };
    });

    run(() => {
        node.save().then(() => {
            saveStubs.forEach(s => assert.ok(s.called));
            assert.ok(addCanonicalStub.calledTwice);
            // Can't use calledWith because sinon's deepEqual creates
            // infinite recursive calls when comparing the Ember DS.Models
            assert.equal(addCanonicalStub.args[0][0], contributors[0]._internalModel, 'First contributor did not match');
            assert.equal(addCanonicalStub.args[1][0], contributors[1]._internalModel, 'Second contributor did not match');
        }).catch((err) => {
            assert.ok(false, `An error occurred while running this test: ${err}`);
        });
    });
});

test('#_createRelated passes the nested:true as an adapterOption to save', function (assert) {
    this.inject.service('store');
    const { store } = this;

    const node = FactoryGuy.make('node');
    begin();
    const contributors = [
        store.createRecord('contributor', {
            title: 'Foo',
        }),
        store.createRecord('contributor', {
            title: 'Bar',
        }),
    ];
    end();
    node.get('contributors').pushObjects(contributors);
    const saveStubs = contributors.map(c => this.stub(c, 'save').callsFake(() => {
        return resolve();
    }));
    this.stub(node, 'resolveRelationship').callsFake(() => {
        return {
            addCanonicalRecord: this.stub(),
        };
    });

    run(() => {
        node.save().then(() => {
            saveStubs.forEach(s => assert.ok(s.called));
            saveStubs.forEach(s => assert.ok(s.calledWith({
                adapterOptions: {
                    url: null,
                    nested: true,
                    requestType: 'create',
                },
            })));
        }).catch((err) => {
            assert.ok(false, `An error occurred while running this test: ${err}`);
        });
    });
});

test('#_addRelated defers to _doRelatedRequest and adds records to the parent\'s canonical state', function (assert) {
    assert.expect(3);

    const node = FactoryGuy.make('node');
    const institution = FactoryGuy.make('institution');
    node.get('affiliatedInstitutions').pushObject(institution);

    const doRelatedStub = this.stub(OsfAdapter.prototype, '_doRelatedRequest').callsFake(() => {
        return resolve();
    });
    const relation = node.resolveRelationship('affiliatedInstitutions');
    relation.hasLoaded = true;
    const addCanonicalStub = this.stub(relation, 'addCanonicalRecord');

    run(() => {
        node.save().then(() => {
            assert.ok(doRelatedStub.called, 'doRelated should be called');
            assert.ok(addCanonicalStub.calledOnce, 'addCanonical should be called');
            assert.ok(addCanonicalStub.calledWith(institution._internalModel), 'addCanonical should be called with the institution');
        }).catch((err) => {
            assert.ok(false, `An error occurred while running this test: ${err}`);
        });
    });
});

test('#_updateRelated defers to _doRelatedRequest, pushes the update response into the store, and updates the parent\'s canonicalState', function (assert) {
    this.inject.service('store');
    const { store } = this;

    const node = FactoryGuy.make('node', 'hasContributors');
    const contribs = node.get('contributors');
    const contrib = contribs.objectAt(1);

    contrib.set('bibliographic', !contrib.get('bibliographic'));

    const doRelatedStub = this.stub(OsfAdapter.prototype, '_doRelatedRequest').callsFake(() => {
        return resolve({
            data: [
                // A slight hack-- ingore the value returned from _doRelatedRequest
                true,
            ],
        });
    });
    const addCanonicalStub = this.stub();
    this.stub(node, 'resolveRelationship').callsFake(() => {
        return {
            addCanonicalRecord: addCanonicalStub,
        };
    });
    const pushStub = this.stub(store, 'push').callsFake(() => contrib);
    const normalizeStub = this.stub(store, 'normalize');

    run(() => {
        node.save().then(() => {
            assert.ok(doRelatedStub.calledOnce);
            assert.ok(addCanonicalStub.calledOnce);
            assert.ok(pushStub.calledOnce);
            assert.ok(normalizeStub.calledOnce);
        }).catch((err) => {
            assert.ok(false, `An error occurred while running this test: ${err}`);
        });
    });
});


test('#_removeRelated defers to _doRelatedRequest, and removes the records from the parent\'s canonicalState', function (assert) {
    assert.expect(3);

    const node = FactoryGuy.make('node', 'hasInstitution');
    const inst = node.get('affiliatedInstitutions').objectAt(0);
    node.get('affiliatedInstitutions').removeObject(inst);

    const doRelatedStub = this.stub(OsfAdapter.prototype, '_doRelatedRequest');

    const rel = node.resolveRelationship('affiliatedInstitutions');
    const removeCanonicalStub = this.stub(rel, 'removeCanonicalRecord');
    rel.hasLoaded = true;

    run(() => {
        node.save().then(() => {
            assert.ok(doRelatedStub.calledOnce, 'doRelated should be called');
            assert.ok(removeCanonicalStub.calledOnce, 'removeCanonical should be called');
            assert.ok(removeCanonicalStub.calledWith(inst._internalModel), 'removeCanonical should be called with institution as an argument');
        }).catch((err) => {
            assert.ok(false, `An error occurred while running this test: ${err}`);
        });
    });
});

test('#_deleteRelated defers to _doRelatedRequest, and unloads the deleted records', function (assert) {
    assert.expect(2);
    const node = FactoryGuy.make('node', 'hasContributors');
    const contrib = node.get('contributors').objectAt(1);
    node.get('contributors').removeObject(contrib);

    const unloadStub = this.stub(contrib, 'unloadRecord');
    const doRelatedStub = this.stub(OsfAdapter.prototype, '_doRelatedRequest', () => {
        return resolve();
    });

    run(() => {
        node.save().then(() => {
            assert.ok(doRelatedStub.calledOnce);
            assert.ok(unloadStub.calledOnce);
        }).catch((err) => {
            assert.ok(false, `An error occurred while running this test: ${err}`);
        });
    });
});

test('#_doRelatedRequest with array', function (assert) {
    const adapter = this.subject();

    this.inject.service('store');
    const { store } = this;

    const node = FactoryGuy.make('node');
    begin();
    const children = FactoryGuy.buildList('node', 3).data.map((json) => {
        return store.createRecord('node', store.normalize('node', json).data.attributes);
    });
    end();

    const mockAjax = this.stub(adapter, 'ajax', () => {
        return resolve({});
    });
    adapter._doRelatedRequest(
        store,
        node._internalModel.createSnapshot(),
        children.map(c => c._internalModel.createSnapshot()),
        'children',
        'http://localhost:8000/v2/nodes/foobar/children/',
        'POST',
    );
    const { data } = mockAjax.args[0][2].data;
    assert.equal(data[0].attributes.title, children[0].get('title'));
    assert.equal(data[1].attributes.title, children[1].get('title'));
    assert.equal(data[2].attributes.title, children[2].get('title'));
});

test('#_doRelatedRequest with single snapshot', function (assert) {
    const adapter = this.subject();

    this.inject.service('store');
    const { store } = this;

    const node = FactoryGuy.make('node');
    begin();
    const child = store.createRecord(
        'node',
        store.normalize('node', FactoryGuy.build('node').data).data.attributes,
    );
    end();

    const mockAjax = this.stub(adapter, 'ajax', () => {
        return resolve({});
    });
    adapter._doRelatedRequest(
        store,
        node._internalModel.createSnapshot(),
        child._internalModel.createSnapshot(),
        'children',
        'http://localhost:8000/v2/nodes/foobar/children/',
        'POST',
    );
    const { data } = mockAjax.args[0][2].data;
    assert.equal(data.attributes.title, child.get('title'));
});

test('#_handleRelatedRequest makes correct calls for each change argument', function (assert) {
    const adapter = this.subject();

    this.inject.service('store');
    const { store } = this;

    const node = FactoryGuy.make('node');
    const changes = {
        delete: FactoryGuy.makeList('node', 2),
        remove: FactoryGuy.makeList('node', 2),
        update: FactoryGuy.makeList('node', 2),
        add: FactoryGuy.makeList('node', 2),
        create: FactoryGuy.makeList('node', 2),
    };
    node.set('_dirtyRelationships', {
        children: changes,
    });

    for (const verb of ['delete', 'remove', 'update', 'add', 'create']) {
        const NodeAdapter = store.adapterFor('node');
        const relatedStub = this.stub(NodeAdapter, `_${verb}Related`);
        adapter._handleRelatedRequest(
            store,
            store.modelFor('node'),
            node._internalModel.createSnapshot(),
            'children',
            verb,
        );
        assert.ok(relatedStub.called);
        assert.deepEqual(
            relatedStub.args[0][2].map(s => s.id),
            changes[verb].map(r => r.get('id')),
        );
    }
});

test('#_handleRelatedRequest checks if relationship supports bulk', function (assert) {
    const adapter = this.subject();

    this.inject.service('store');
    const { store } = this;

    const node = FactoryGuy.make('node');
    const changes = {
        update: FactoryGuy.makeList('node', 2),
        add: FactoryGuy.makeList('node', 2),
        create: FactoryGuy.makeList('node', 2),
    };
    node.set('_dirtyRelationships', {
        children: changes,
    });
    const rel = node.resolveRelationship('children');
    const opts = {
        allowBulkUpdate: true,
        allowBulkCreate: false,
        allowBulkAdd: true,
    };
    this.stub(rel, 'meta', () => opts);

    for (const verb of ['update', 'add', 'create']) {
        const NodeAdapter = store.adapterFor('node');
        const relatedStub = this.stub(NodeAdapter, `_${verb}Related`);
        adapter._handleRelatedRequest(
            store,
            store.modelFor('node'),
            node._internalModel.createSnapshot(),
            'children',
            verb,
        );
        assert.ok(relatedStub.called);
        assert.equal(
            opts[verb],
            relatedStub.args[0].pop(),
        );
    }
});

test('#updateRecord handles both dirtyRelationships and the parent record', function (assert) {
    assert.expect(2);

    this.inject.service('store');

    const { store } = this;
    const adapter = this.subject();
    const node = FactoryGuy.make('node');

    run(() => node.set('title', 'The meaning of life'));

    node.set('_dirtyRelationships', {
        children: {
            update: null,
        },
    });

    const handleRelatedStub = this.stub(adapter, '_handleRelatedRequest', () => []);
    // Have to stub apply due to ...arguments usage
    this.stub(JSONAPIAdapter.prototype.updateRecord, 'apply', () => resolve(42));

    const ss = node._internalModel.createSnapshot();

    return adapter
        .updateRecord(store, node, ss).then((res) => {
            // Note: 42 comes from promise resolution of stubbed updateRecord above
            assert.equal(res, 42);
            assert.ok(handleRelatedStub.calledWith(
                store,
                node,
                ss,
                'children',
                'update',
            ));
        });
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
            .then((res) => {
                children = res;
                return node.get('children').pushObjects(res);
            })
            .then(() => {
                node.set('title', 'Parent');
                return store.findRecord('node', node.id, { include: 'children' });
            })
            .then((res) => {
                assert.equal(
                    res.get('children').toArray()[0].get('title'),
                    children[0].get('title'),
                );
            })
            .then(done);
    });
});
