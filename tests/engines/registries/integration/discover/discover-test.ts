import EngineInstance from '@ember/engine/instance';
import { click } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import Analytics from 'ember-osf-web/services/analytics';
import { visit } from 'ember-osf-web/tests/helpers';
import { loadEngine } from 'ember-osf-web/tests/helpers/engines';
import param from 'ember-osf-web/utils/param';
import { setupApplicationTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { OrderedSet } from 'immutable';
import { module, test } from 'qunit';
import { SearchOptions, SearchOrder, SearchResults } from 'registries/services/search';
import ShareSearch, {
    ShareRegistration,
    ShareTermsAggregation,
    ShareTermsFilter,
} from 'registries/services/share-search';
import sinon from 'sinon';

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
    name: string;
    params: { [key: string]: any };
    expected: { [key: string]: any };
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
        params: { q: 'Foo', provider: 'OSF' },
        expected: {
            order,
            query: 'Foo',
            filters: OrderedSet([
                new ShareTermsFilter('sources', 'OSF', 'OSF Registries'),
            ]),
        },
    }, {
        name: 'Multiple Providers Filters With Validation',
        params: { q: 'Foo', provider: 'OSF|ClinicalTrials.gov|Bar' },
        expected: {
            order,
            query: 'Foo',
            filters: OrderedSet([
                new ShareTermsFilter('sources', 'OSF', 'OSF Registries'),
                new ShareTermsFilter('sources', 'ClinicalTrials.gov', 'ClinicalTrials.gov'),
            ]),
        },
    }, {
        name: 'Multiple Legacy Providers Filters With Validation',
        params: { q: 'Foo', provider: 'OSFORClinicalTrials.govORFoo' },
        expected: {
            order,
            query: 'Foo',
            filters: OrderedSet([
                new ShareTermsFilter('sources', 'OSF', 'OSF Registries'),
                new ShareTermsFilter('sources', 'ClinicalTrials.gov', 'ClinicalTrials.gov'),
            ]),
        },
    }, {
        name: 'Sort',
        params: { sort: 'date_updated' },
        expected: {
            query: '',
            order: new SearchOrder({
                ascending: true,
                display: 'registries.discover.order.modified_ascending',
                key: 'date_updated',
            }),
        },
    }, {
        name: 'Sort decending',
        params: { sort: '-date_updated' },
        expected: {
            query: '',
            order: new SearchOrder({
                ascending: false,
                display: 'registries.discover.order.modified_descending',
                key: 'date_updated',
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
        params: { q: 'What', page: 10, provider: 'OSF', type: 'Foo|BAR' },
        expected: {
            order,
            query: 'What',
            page: 10,
            filters: OrderedSet([
                new ShareTermsFilter('sources', 'OSF', 'OSF Registries'),
                new ShareTermsFilter('registration_type', 'Foo', 'Foo'),
                new ShareTermsFilter('registration_type', 'BAR', 'BAR'),
            ]),
        },
    }, {
    // NOTE: Not currently validated :(
        name: 'Legacy Registration Types',
        params: { q: 'What', page: 10, provider: 'OSF', type: 'FooORBAR' },
        expected: {
            order,
            query: 'What',
            page: 10,
            filters: OrderedSet([
                new ShareTermsFilter('sources', 'OSF', 'OSF Registries'),
                new ShareTermsFilter('registration_type', 'Foo', 'Foo'),
                new ShareTermsFilter('registration_type', 'BAR', 'BAR'),
            ]),
        },
    }];

const AnalyticsTestCases: Array<{
    name: string;
    action: (stub: sinon.SinonStub) => Promise<void>,
    expected: {
    action: string;
    category: string;
    label: string;
    extra?: string;
    }
    }> = [{
        name: 'SHARE Logo Clicked',
        action: async () => click('[data-test-share-logo]'),
        expected: {
            action: 'click',
            category: 'link',
            label: 'Discover - SHARE Logo',
        },
    }, {
        name: 'Sort by (Date Modified)',
        action: async () => {
            await click('[data-test-sort-dropdown]');
            await click('[data-test-sort-option-id="2"]');
        },
        expected: {
            category: 'dropdown',
            action: 'select',
            label: 'Discover - Sort By: Modified Date (newest to oldest)',
        },
    }, {
        name: 'Sort by (Relevance)',
        action: async () => {
            await click('[data-test-sort-dropdown]');
            await click('[data-test-sort-option-id="0"]');
        },
        expected: {
            category: 'dropdown',
            action: 'select',
            label: 'Discover - Sort By: Relevance',
        },
    }, {
        name: 'Clear Filters',
        action: async () => click('[data-test-clear-filters]'),
        expected: {
            category: 'button',
            action: 'click',
            label: 'Discover - Clear Filters',
        },
    }, {
        name: 'Check Source Filter (OSF)',
        action: async () => click('[data-test-source-filter-id="0"]'),
        expected: {
            category: 'filter',
            action: 'add',
            label: 'Discover - providers OSF Registries',
        },
    }, {
        name: 'Check Source Filter (Clinical Trials)',
        action: async () => click('[data-test-source-filter-id="1"]'),
        expected: {
            category: 'filter',
            action: 'add',
            label: 'Discover - providers ClinicalTrials.gov',
        },
    }, {
        name: 'Uncheck Source Filter (OSF)',
        action: async stub => {
            await click('[data-test-source-filter-id="0"]');
            stub.reset();
            await click('[data-test-source-filter-id="0"]');
        },
        expected: {
            category: 'filter',
            action: 'remove',
            label: 'Discover - providers OSF Registries',
        },
    }, {
        name: 'Uncheck Source Filter (Clinical Trials)',
        action: async stub => {
            await click('[data-test-source-filter-id="1"]');
            stub.reset();
            await click('[data-test-source-filter-id="1"]');
        },
        expected: {
            category: 'filter',
            action: 'remove',
            label: 'Discover - providers ClinicalTrials.gov',
        },
    }, {
        name: 'Check Registration Type Filter (Open Ended)',
        action: async stub => {
            await click('[data-test-source-filter-id="0"]');
            stub.reset();
            await click('[data-test-registration-type-filter-id="2"]');
        },
        expected: {
            category: 'filter',
            action: 'add',
            label: 'Discover - type Open Ended',
        },
    }, {
        name: 'Check Registration Type Filter (Close Fronted)',
        action: async stub => {
            await click('[data-test-source-filter-id="0"]');
            stub.reset();
            await click('[data-test-registration-type-filter-id="0"]');
        },
        expected: {
            category: 'filter',
            action: 'add',
            label: 'Discover - type Close Fronted',
        },
    }, {
        name: 'Unheck Registration Type Filter (Open Ended)',
        action: async stub => {
            await click('[data-test-source-filter-id="0"]');
            await click('[data-test-registration-type-filter-id="2"]');
            stub.reset();
            await click('[data-test-registration-type-filter-id="2"]');
        },
        expected: {
            category: 'filter',
            action: 'remove',
            label: 'Discover - type Open Ended',
        },
    }, {
        name: 'Uncheck Registration Type Filter (Close Fronted)',
        action: async stub => {
            await click('[data-test-source-filter-id="0"]');
            await click('[data-test-registration-type-filter-id="0"]');
            stub.reset();
            await click('[data-test-registration-type-filter-id="0"]');
        },
        expected: {
            category: 'filter',
            action: 'remove',
            label: 'Discover - type Close Fronted',
        },
    }, {
        name: 'Click Result Title (id = 1)',
        action: async () => click('[data-test-result-title-id="1"]'),
        expected: {
            category: 'link',
            action: 'click',
            label: 'Discover - Result Title: https://example.com/cancer-potatoes',
            extra: '1',
        },
    }, {
        name: 'Click Result Title (id = 2)',
        action: async () => click('[data-test-result-title-id="2"]'),
        expected: {
            category: 'link',
            action: 'click',
            label: 'Discover - Result Title: https://example.com/super-potatoes',
            extra: '2',
        },
    }, {
        name: 'Click Result Link (id = 1)',
        action: async stub => {
            await click('[data-test-result-toggle-id="1"]');
            stub.reset();
            await click('[data-test-result-hyperlink-id="1 - 0"]');
        },
        expected: {
            category: 'link',
            action: 'click',
            label: 'Discover - Result Hyperlink: https://reddit.com/r/cancer-potatoes',
            extra: '1',
        },
    }, {
        name: 'Click Result Link (id = 2)',
        action: async stub => {
            await click('[data-test-result-toggle-id="2"]');
            stub.reset();
            await click('[data-test-result-hyperlink-id="2 - 0"]');
        },
        expected: {
            category: 'link',
            action: 'click',
            label: 'Discover - Result Hyperlink: https://reddit.com/r/super-potatoes',
            extra: '2',
        },
    }, {
        name: 'Collapse Result',
        action: async () => click('[data-test-result-toggle-id="1"]'),
        expected: {
            category: 'result',
            action: 'contract',
            label: 'Discover - Can Potatoes Cause Cancer?',
            extra: '1',
        },
    }, {
        name: 'Expand Result',
        action: async () => click('[data-test-result-toggle-id="1"]'),
        expected: {
            category: 'result',
            action: 'expand',
            label: 'Discover - Can Potatoes Cause Cancer?',
            extra: '1',
        },
    }];

module('Registries | Integration | discover', hooks => {
    setupApplicationTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(async function(this: TestContext) {
        server.create('root', { currentUser: null });
        server.create('registration-schema', { name: 'Open Ended' });
        server.create('registration-schema', { name: 'Close Fronted' });

        const engine = await loadEngine('registries', 'registries');

        const shareSearch = new ShareSearch();

        engine.register('service:share-search', shareSearch, { instantiate: false });
        this.owner.register('service:share-search', shareSearch, { instantiate: false });
    });

    test('query parameters', async function(this: TestContext, assert: Assert) {
        assert.expect(2 + (QueryParamTestCases.length * 6));
        const stub = sinon.stub(this.owner.lookup('service:share-search'), 'registrations').returns(emptyResults);

        // Initial load so we don't have to deal with the aggregations loading
        await visit('/registries/discover');
        sinon.assert.calledTwice(stub);
        // Aggregations on load
        sinon.assert.calledWith(stub, new SearchOptions({
            size: 0,
            modifiers: OrderedSet([
                new ShareTermsAggregation('sources', 'sources'),
            ]),
        }));

        for (const url of ['/--registries/registries/discover', '/registries/discover']) {
            for (const testCase of QueryParamTestCases) {
                stub.reset();
                stub.returns(emptyResults);

                await visit(`${url}?${param(testCase.params)}`);

                assert.ok(true, testCase.name);
                sinon.assert.calledOnce(stub);
                sinon.assert.calledWith(stub, new SearchOptions(testCase.expected));
            }
        }
    });

    test('analytics', async function(this: TestContext, assert: Assert) {
        assert.expect(AnalyticsTestCases.length * 3);
        const engine = this.owner.lookup('-engine-instance:registries-registries') as EngineInstance;

        sinon.stub(engine.lookup('service:share-search'), 'registrations').returns({
            total: 420,
            results: [{
                id: '1',
                title: 'Can Potatoes Cause Cancer?',
                description: 'THEY CAN AND THEY WILL',
                mainLink: 'https://example.com/cancer-potatoes',
                contributors: [],
                hyperLinks: [
                    'https://reddit.com/r/cancer-potatoes',
                ],
            }, {
                id: '2',
                title: 'Can Potatoes Cure Cancer?',
                description: 'THEY CAN AND THEY WILL',
                mainLink: 'https://example.com/super-potatoes',
                contributors: [],
                hyperLinks: [
                    'https://reddit.com/r/super-potatoes',
                ],
            }],
            aggregations: {
                sources: {
                    buckets: [
                        { key: 'ClinicalTrials.gov', doc_count: 25 },
                        { key: 'OSF', doc_count: 10 },
                    ],
                },
            },
        });

        const analytics = engine.lookup('service:analytics');
        analytics.actions.click = function(this: Analytics, ...args: any[]) {
            (this.click as any)(...args);
            const event = args[args.length - 1] as MouseEvent;

            // Prevent redirects from being followed
            if (!event.preventDefault) {
                return true;
            }

            event.preventDefault();
            return false;
        };
        const metrics = this.owner.lookup('service:metrics');
        const stub = sinon.stub(metrics, 'trackEvent');

        for (const testCase of AnalyticsTestCases) {
            stub.reset();
            assert.ok(true, testCase.name);

            await visit('/--registries/registries/discover');

            await testCase.action(stub);

            sinon.assert.calledOnce(stub);
            sinon.assert.calledWith(stub, Object.assign({ extra: undefined }, testCase.expected));
        }
    });
});
