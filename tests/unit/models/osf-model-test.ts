import { run } from '@ember/runloop';
import { RelationshipsFor } from 'ember-data';
import { startMirage } from 'ember-osf-web/initializers/ember-cli-mirage';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

import Node from 'ember-osf-web/models/node';
import { RequestOptions, SparseHasManyResult } from 'ember-osf-web/models/osf-model';
import { buildFieldsParam, SparseFieldset } from 'ember-osf-web/utils/sparse-fieldsets';
import { ResourceCollectionDocument } from 'osf-api';

module('Unit | Model | osf-model', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('osf-model'));
        assert.ok(!!model);
    });

    test('queryHasMany works', async function(assert) {
        const server = startMirage();
        const store = this.owner.lookup('service:store');
        const userId = '1';

        await run(async () => {
            const userOne = server.create('user', { id: userId });
            const nodeList = server.createList('node', 3, {});
            for (const node of nodeList) {
                server.create('contributor', { node, users: userOne });
            }
            const user = await store.findRecord('user', userId);
            assert.ok(!!user);
            assert.equal(user.get('id'), userId, 'Checking user id.');
            const nodeIds = nodeList.map((node: any) => node.id);

            const nodes = await user.queryHasMany('nodes');

            assert.equal(nodes.length, nodeIds.length);
            assert.notEqual(nodes.length, 0);
            for (const node of nodes) {
                assert.ok((nodeIds.indexOf(node.id) !== -1),
                    `All the node ids should be in the array, but ${node.id} isn't in nodeIds.`);
            }
        });

        server.shutdown();
    });

    test('createM2MRelationship/deleteM2MRelationship works', async function(assert) {
        const server = startMirage();
        const store = this.owner.lookup('service:store');

        await run(async () => {
            const userOne = server.create('user');
            const registrationOne = server.create('registration');
            const institutionOne = server.create('institution', { users: [userOne] });

            server.create('contributor', { node: registrationOne, users: userOne });

            const user = await store.findRecord('user', userOne.id, { include: 'institutions' });
            const registration = await store.findRecord('registration', registrationOne.id);
            const institution = user.institutions.toArray()[0];

            let response: {data: Array<{id: string, type: string}>};
            response = await registration.createM2MRelationship(
                'affiliatedInstitutions',
                institution,
            );
            assert.ok(response.data.findBy('id', institutionOne.id), 'createM2MRelationship works');

            response = await registration.deleteM2MRelationship(
                'affiliatedInstitutions',
                institution,
            );
            assert.notOk(response.data.findBy('id', institutionOne.id), 'deleteM2MRelationship works');
        });

        server.shutdown();
    });

    test('sparseHasMany calls the right things', async function(assert) {
        interface TestCase {
            relation: RelationshipsFor<Node>;
            fieldset: SparseFieldset;
            options?: RequestOptions;
            response: ResourceCollectionDocument;
            expectedResult: SparseHasManyResult;
        }

        const testCases: TestCase[] = [
            {
                relation: 'contributors',
                fieldset: { contributor: ['index'] },
                response: {
                    data: [
                        { id: 'foo', type: 'contributors', attributes: { index: 0 } },
                        { id: 'foob', type: 'contributors', attributes: { index: 1 } },
                    ],
                    meta: { total: 2, per_page: 10, version: '' },
                    links: { self: 'selflink' },
                },
                expectedResult: {
                    sparseModels: [
                        { id: 'foo', modelName: 'contributor', index: 0 },
                        { id: 'foob', modelName: 'contributor', index: 1 },
                    ],
                    meta: { total: 2, per_page: 10, version: '' },
                    links: { self: 'selflink' },
                },
            }, {
                relation: 'contributors',
                fieldset: { contributor: ['index', 'users'], user: ['fullName'] },
                response: {
                    data: [
                        {
                            id: 'foo',
                            type: 'contributors',
                            attributes: { index: 1 },
                            embeds: {
                                users: {
                                    data: {
                                        id: 'userfoo',
                                        type: 'users',
                                        attributes: { full_name: 'mega user' },
                                    },
                                    meta: { version: '' },
                                },
                            },
                        }, {
                            id: 'bar',
                            type: 'contributors',
                            attributes: { index: 2 },
                            embeds: {
                                users: {
                                    data: {
                                        id: 'userbar',
                                        type: 'users',
                                        attributes: { full_name: 'mogi user' },
                                    },
                                    meta: { version: '' },
                                },
                            },
                        },
                    ],
                    meta: { total: 2, per_page: 10, version: '' },
                },
                expectedResult: {
                    sparseModels: [
                        {
                            id: 'foo',
                            modelName: 'contributor',
                            index: 1,
                            users: {
                                id: 'userfoo',
                                modelName: 'user',
                                fullName: 'mega user',
                            },
                        }, {
                            id: 'bar',
                            modelName: 'contributor',
                            index: 2,
                            users: {
                                id: 'userbar',
                                modelName: 'user',
                                fullName: 'mogi user',
                            },
                        },
                    ],
                    meta: { total: 2, per_page: 10, version: '' },
                },
            },
        ];

        assert.expect(2 * testCases.length);
        const sandbox = sinon.createSandbox();
        const node: Node = this.owner.lookup('service:store').createRecord('node');

        for (const testCase of testCases) {
            const url = `http://api.example.com/has-many/${testCase.relation}`;
            sandbox.stub(node, 'getHasManyLink').returns(url);

            const ajaxStub = sandbox.stub(node.currentUser, 'authenticatedAJAX')
                .resolves(testCase.response);

            const result = await node.sparseHasMany(
                testCase.relation,
                testCase.fieldset,
                testCase.options,
            );

            const { queryParams = {}, ajaxOptions = {} } = testCase.options || {};

            assert.ok(ajaxStub.calledOnceWithExactly({
                url,
                data: {
                    fields: buildFieldsParam(testCase.fieldset),
                    ...queryParams,
                },
                ...ajaxOptions,
            }), 'sparseHasMany calls authenticatedAJAX');

            assert.deepEqual(
                result,
                testCase.expectedResult,
                'sparseHasMany returns the right thing',
            );

            sandbox.restore();
        }
    });

    test('sparseLoadAll calls the right things', async function(assert) {
        const totals = [0, 47, 153, 432];
        const sandbox = sinon.createSandbox();
        const node: Node = this.owner.lookup('service:store').createRecord('node');
        const pageSize = 100;

        for (const total of totals) {
            const id = 1;
            let allResults = Array.from({ length: total }).map(() => ({ id, modelName: 'foo' }));

            const sparseHasManyStub = sandbox.stub(node, 'sparseHasMany').callsFake(async () => {
                const sparseModels = allResults.slice(0, pageSize);
                allResults = allResults.slice(pageSize);
                return {
                    sparseModels,
                    meta: { total, per_page: pageSize, version: '' },
                };
            });

            const result = await node.sparseLoadAll('contributors', { contributor: ['index'] });

            assert.equal(result.length, total, 'Correct number of sparse models');
            assert.equal(
                sparseHasManyStub.callCount,
                Math.max(1, Math.ceil(total / pageSize)),
                'Called sparseHasMany neither too much nor too little',
            );

            sandbox.restore();
        }
    });
});
