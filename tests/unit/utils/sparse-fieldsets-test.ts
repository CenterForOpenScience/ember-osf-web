import { module, test } from 'qunit';

import {
    buildFieldsParam,
    parseSparseResource,
    SparseFieldset,
    SparseModel,
} from 'ember-osf-web/utils/sparse-fieldsets';
import { Resource } from 'osf-api';

module('Unit | Utility | sparse fieldsets', () => {
    test('buildFieldsParam works', assert => {
        const testCases: Array<{ fieldset: SparseFieldset, expected: Record<string, string> }> = [
            { fieldset: {}, expected: {} },
            { fieldset: { user: ['fullName'] }, expected: { users: 'full_name' } },
            { fieldset: { user: ['fullName', 'givenName'] }, expected: { users: 'full_name,given_name' } },
            {
                fieldset: { contributor: ['users', 'index'], user: ['fullName', 'givenName'] },
                expected: { contributors: 'index,users', users: 'full_name,given_name' },
            },
            {
                fieldset: { 'draft-registration': ['registrationMetadata', 'initiator'], user: ['fullName'] },
                expected: { draft_registrations: 'initiator,registration_metadata', users: 'full_name' },
            },
        ];

        testCases.forEach((testCase, i) => {
            assert.deepEqual(
                buildFieldsParam(testCase.fieldset),
                testCase.expected,
                `buildFieldsParam builds 'fields' param (case ${i})`,
            );
        });
    });

    test('parseSparseResource works', assert => {
        const testCases: Array<{ resource: Resource, expected: SparseModel }> = [
            {
                resource: {
                    id: 'foo',
                    type: 'users',
                },
                expected: {
                    id: 'foo',
                    modelName: 'user',
                },
            }, {
                resource: {
                    id: 'blah',
                    type: 'users',
                    attributes: {
                        full_name: 'blah blah',
                    },
                },
                expected: {
                    id: 'blah',
                    modelName: 'user',
                    fullName: 'blah blah',
                },
            }, {
                resource: {
                    id: 'cont1',
                    type: 'contributors',
                    attributes: {
                        index: 1,
                    },
                    embeds: {
                        users: {
                            data: {
                                id: 'user1',
                                type: 'users',
                                attributes: {
                                    full_name: 'blah blah',
                                },
                            },
                            meta: { total: 1, per_page: 1, version: '9' },
                        },
                    },
                },
                expected: {
                    id: 'cont1',
                    modelName: 'contributor',
                    index: 1,
                    users: {
                        id: 'user1',
                        modelName: 'user',
                        fullName: 'blah blah',
                    },
                },
            }, {
                resource: {
                    id: 'node1',
                    type: 'nodes',
                    attributes: {},
                    embeds: {
                        contributors: {
                            data: [{
                                id: 'contrib1',
                                type: 'contributors',
                                attributes: { index: 0 },
                            }, {
                                id: 'contrib2',
                                type: 'contributors',
                                attributes: { index: 1 },
                            }, {
                                id: 'contrib3',
                                type: 'contributors',
                                attributes: { index: 2 },
                            }, {
                                id: 'contrib4',
                                type: 'contributors',
                                attributes: { index: 3 },
                            }],
                            meta: { total: 4, per_page: 10, version: '9' },
                        },
                    },
                },
                expected: {
                    id: 'node1',
                    modelName: 'node',
                    contributors: [
                        { id: 'contrib1', modelName: 'contributor', index: 0 },
                        { id: 'contrib2', modelName: 'contributor', index: 1 },
                        { id: 'contrib3', modelName: 'contributor', index: 2 },
                        { id: 'contrib4', modelName: 'contributor', index: 3 },
                    ],
                },
            },
        ];

        testCases.forEach((testCase, i) => {
            assert.deepEqual(
                parseSparseResource(testCase.resource),
                testCase.expected,
                `parseSparseResource parses a sparse resource (case ${i})`,
            );
        });
    });
});
