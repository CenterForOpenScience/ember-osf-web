import { click, fillIn, getRootElement, triggerEvent } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { TestContext } from 'ember-test-helpers';
import { OrderedSet, ValueObject } from 'immutable';
import { module, test } from 'qunit';
import sinon from 'sinon';

import { setupOSFApplicationTest, visit } from 'ember-osf-web/tests/helpers';
import { loadEngine } from 'ember-osf-web/tests/helpers/engines';
import param from 'ember-osf-web/utils/param';

import { SearchOptions, SearchOrder, SearchResults } from 'registries/services/search';
import ShareSearch, {
    ShareRegistration,
    ShareTermsAggregation,
    ShareTermsFilter,
} from 'registries/services/share-search';

const equals = (expected: ValueObject) => sinon.match((x: any) => expected.equals(x));

const emptyResults: SearchResults<ShareRegistration> = {
    total: 0,
    results: [],
    aggregations: {
        sources: {
            buckets: [],
        },
    },
};

// Default page ordering
const order = new SearchOrder({
    ascending: true,
    display: 'registries.discover.order.relevance',
    key: undefined,
});

const QueryParamTestCases: Array<{
    name: string,
    params: { [key: string]: any },
    expected: { [key: string]: any },
    }> = [{
        name: 'Order by date_modified if no additional options are specified',
        params: {},
        expected: {
            query: '',
            order: new SearchOrder({
                display: 'registries.discover.order.relevance',
                ascending: false,
                key: 'date_modified',
            }),
        },
    }, {
        name: 'Basic query parameters',
        params: { q: 'What', page: 10 },
        expected: { order, query: 'What', page: 10 },
    }, {
        name: 'Providers Filters',
        params: { q: 'Foo', provider: 'OSF Registries' },
        expected: {
            order,
            query: 'Foo',
            filters: OrderedSet([
                new ShareTermsFilter('sources', 'OSF Registries', 'OSF Registries'),
            ]),
        },
    }, {
        name: 'Multiple Providers Filters With Validation',
        params: { q: 'Foo', provider: 'OSF Registries|ClinicalTrials.gov|Bar' },
        expected: {
            order,
            query: 'Foo',
            filters: OrderedSet([
                new ShareTermsFilter('sources', 'OSF Registries', 'OSF Registries'),
                new ShareTermsFilter('sources', 'ClinicalTrials.gov', 'ClinicalTrials.gov'),
            ]),
        },
    }, {
        name: 'Sort',
        params: { sort: 'date' },
        expected: {
            query: '',
            order: new SearchOrder({
                ascending: true,
                display: 'registries.discover.order.modified_ascending',
                key: 'date',
            }),
        },
    }, {
        name: 'Sort decending',
        params: { sort: '-date' },
        expected: {
            query: '',
            order: new SearchOrder({
                ascending: false,
                display: 'registries.discover.order.modified_descending',
                key: 'date',
            }),
        },
    }, {
        name: 'Sort validation',
        params: { q: 'Not Empty', sort: '-date_moodified' },
        expected: { order, query: 'Not Empty' },
    }, {
        name: 'Registration Types without OSF',
        params: { q: 'What', page: 10, type: 'Foo|BAR' },
        expected: { order, query: 'What', page: 10 },
    }, {
    // NOTE: Not currently validated :(
        name: 'Registration Types',
        params: { q: 'What', page: 10, provider: 'OSF Registries', type: 'Foo|BAR' },
        expected: {
            order,
            query: 'What',
            page: 10,
            filters: OrderedSet([
                new ShareTermsFilter('sources', 'OSF Registries', 'OSF Registries'),
                new ShareTermsFilter('registration_type', 'Foo', 'Foo'),
                new ShareTermsFilter('registration_type', 'BAR', 'BAR'),
            ]),
        },
    }];

module('Registries | Integration | discover', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(async function(this: TestContext) {
        server.create('registration-schema', { name: 'Open Ended' });
        server.create('registration-schema', { name: 'Close Fronted' });
        server.create('registration-provider', {
            id: 'osf',
            shareSource: 'OSF Registries',
            name: 'OSF Registries',
        });
        server.create('registration-provider', {
            id: 'someother',
            shareSource: 'someother',
            name: 'Some Other',
        });
        server.create('registration-provider', {
            id: 'clinicaltrials',
            shareSource: 'ClinicalTrials.gov',
            name: 'ClinicalTrials.gov',
        });

        const engine = await loadEngine('registries', 'registries');

        const shareSearch = ShareSearch.create();

        engine.register('service:share-search', shareSearch, { instantiate: false });
        this.owner.register('service:share-search', shareSearch, { instantiate: false });
    });

    test('query parameters', async function(this: TestContext, assert: Assert) {
        const stub = sinon.stub(this.owner.lookup('service:share-search'), 'registrations').returns(emptyResults);

        // Initial load so we don't have to deal with the aggregations loading
        await visit('/registries/discover');
        assert.ok(stub.calledTwice, 'stub called twice upon discover page load');
        // Aggregations on load
        assert.ok(stub.calledWith(new SearchOptions({
            size: 0,
            modifiers: OrderedSet([
                new ShareTermsAggregation('sources', 'sources'),
            ]),
        })), 'stub called with the expected arguments');

        for (const url of ['/--registries/registries/discover', '/registries/discover']) {
            for (const testCase of QueryParamTestCases) {
                stub.reset();
                stub.returns(emptyResults);
                const params = param(testCase.params);

                await visit(`${url}?${params}`);

                assert.ok(true, testCase.name);
                assert.ok(stub.calledOnce, 'stub called once');
                assert.ok(
                    stub.calledWith(new SearchOptions(testCase.expected)),
                    `stub called with the expected arguments for: url: ${url}, params: ${params}`,
                );
            }
        }
    });

    test('page resets on filtering', async function(this: TestContext, assert) {
        assert.expect(3);
        const stub = sinon.stub(this.owner.lookup('service:share-search'), 'registrations').returns({
            total: 0,
            results: [],
            aggregations: {
                sources: {
                    buckets: [
                        { key: 'OSF Registries', doc_count: 10 },
                        { key: 'someother', doc_count: 10 },
                        { key: 'clinicaltrials', doc_count: 10 },
                    ],
                },
            },
        });

        await visit('/registries/discover?page=10');

        assert.ok(stub.calledWith(new SearchOptions({
            query: '',
            page: 10,
            order: new SearchOrder({
                display: 'registries.discover.order.relevance',
                ascending: false,
                key: 'date_modified',
            }),
        })), '/registries/discover?page=10: stub called with expected arguments');

        await click('[data-test-source-filter-id="OSF Registries"]');

        assert.ok(stub.calledWith(new SearchOptions({
            query: '',
            page: 1,
            order,
            filters: OrderedSet([
                new ShareTermsFilter('sources', 'OSF Registries', 'OSF Registries'),
            ]),
        })), 'stub called with expected arguments');
    });

    test('page resets on sorting', async function(this: TestContext, assert) {
        assert.expect(3);
        const stub = sinon.stub(this.owner.lookup('service:share-search'), 'registrations').returns({
            total: 0,
            results: [],
            aggregations: {
                sources: {
                    buckets: [{ key: 'OSF Registries', doc_count: 10 }],
                },
            },
        });

        await visit('/registries/discover?page=10');

        assert.ok(stub.calledWith(new SearchOptions({
            query: '',
            page: 10,
            order: new SearchOrder({
                display: 'registries.discover.order.relevance',
                ascending: false,
                key: 'date_modified',
            }),
        })), 'stub for service:share-search.registrations called with expected arguments');

        await click('[data-test-sort-dropdown]');
        await click('[data-test-sort-option-id="1"]');

        assert.ok(stub.calledWith(new SearchOptions({
            query: '',
            page: 1,
            order: new SearchOrder({
                ascending: true,
                display: 'registries.discover.order.modified_ascending',
                key: 'date',
            }),
        })), 'stub for service:share-search.registrations called with expected arguments');
    });

    test('page resets on typing query', async function(this: TestContext, assert) {
        assert.expect(3);
        const stub = sinon.stub(this.owner.lookup('service:share-search'), 'registrations').returns({
            total: 0,
            results: [],
            aggregations: {
                sources: {
                    buckets: [{ key: 'OSF Registries', doc_count: 10 }],
                },
            },
        });

        await visit('/registries/discover?page=10');

        assert.ok(stub.calledWith(equals(new SearchOptions({
            query: '',
            page: 10,
            order: new SearchOrder({
                display: 'registries.discover.order.relevance',
                ascending: false,
                key: 'date_modified',
            }),
        }))));

        await fillIn('[data-test-search-box]', 'Test Query');

        assert.ok(stub.calledWith(equals(new SearchOptions({
            query: 'Test Query',
            page: 1,
            order: new SearchOrder({
                display: 'registries.discover.order.relevance',
                ascending: true,
                key: undefined,
            }),
        }))));
    });

    test('page resets on clicking search', async function(this: TestContext, assert) {
        assert.expect(3);
        sinon.stub(this.owner.lookup('service:analytics'), 'click');
        const stub = sinon.stub(this.owner.lookup('service:share-search'), 'registrations').returns({
            total: 0,
            results: [],
            aggregations: {
                sources: {
                    buckets: [{ key: 'OSF Registries', doc_count: 10 }],
                },
            },
        });

        await visit('/registries/discover?page=10&q=Testing');

        assert.ok(stub.calledWith(equals(new SearchOptions({
            query: 'Testing',
            page: 10,
            order: new SearchOrder({
                display: 'registries.discover.order.relevance',
                ascending: true,
                key: undefined,
            }),
        }))));

        await triggerEvent('[data-test-search-form]', 'submit');

        assert.ok(stub.calledWith(equals(new SearchOptions({
            query: 'Testing',
            page: 1,
            order: new SearchOrder({
                display: 'registries.discover.order.relevance',
                ascending: true,
                key: undefined,
            }),
        }))));
    });

    test('scroll top on pagination', async function(this: TestContext, assert: Assert) {
        assert.expect(3);
        const results = {
            total: 21,
            results: Array(21).fill({
                title: 'place holder',
                description: 'place holder',
                contributors: [],
                mainLink: 'fakeLink',
            }),
            aggregations: {
                sources: {
                    buckets: [],
                },
            },
        };

        const stub = sinon.stub(this.owner.lookup('service:share-search'), 'registrations').returns(results);

        await visit('/registries/discover');

        stub.reset();
        stub.returns(results);

        const resultsEl = getRootElement().querySelector('[data-test-results]')! as HTMLElement;

        const initialTopPosition = resultsEl.getBoundingClientRect().top;
        await click('[data-test-page-number="2"]');
        const currentTopPosition = resultsEl.getBoundingClientRect().top;
        assert.ok(currentTopPosition < initialTopPosition, 'we have scrolled');
        assert.ok(stub.calledWith(new SearchOptions({
            query: '',
            page: 2,
            order: new SearchOrder({
                display: 'registries.discover.order.relevance',
                ascending: false,
                key: 'date_modified',
            }),
        })), 'stub called with expected arguments');
    });
});
