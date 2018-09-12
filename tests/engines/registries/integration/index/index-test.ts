import EngineInstance from '@ember/engine/instance';
import { click, fillIn, triggerKeyEvent, visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import Analytics from 'ember-osf-web/services/analytics';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';
import HeaderStyles from 'registries/components/registries-header/styles';
import ServiceListStyles from 'registries/components/registries-services-list/styles';
import ShareSearch from 'registries/services/share-search';
import sinon from 'sinon';

module('Registries | Integration | index', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        server.create('root', { currentUser: null });

        const engine = this.owner.lookup('-engine-instance:registries-registries') as EngineInstance;

        const shareSearch = new ShareSearch();
        engine.register('service:share-search', shareSearch, { instantiate: false });
        this.owner.register('service:share-search', shareSearch, { instantiate: false });

        sinon.stub(shareSearch, 'registrations').returns({
            total: 420,
            results: [{
                id: '1',
                title: 'Can Potatoes Cause Cancer?',
                description: 'THEY CAN AND THEY WILL',
                mainLink: 'https://example.com/cancer-potatoes',
                contributors: [],
                hyperLinks: [],
            }, {
                id: '2',
                title: 'Can Potatoes Cure Cancer?',
                description: 'THEY CAN AND THEY WILL',
                mainLink: 'https://example.com/super-potatoes',
                contributors: [],
                hyperLinks: [],
            }],
            aggregations: {
                sources: {
                    buckets: [],
                },
            },
        });

        const analytics = engine.lookup('service:analytics');
        analytics.set('click', sinon.stub(analytics, 'click'));
        analytics.actions.click = analytics.click;
    });

    test('analytics', async function(this: TestContext, assert: Assert) {
        const testCases: Array<{
            name: string;
            action: () => Promise<void>,
            // category, label, extra
            expected: Array<string | sinon.SinonMatcher>
            }> = [
                {
                    name: 'Search Button (Clicked)',
                    action: async () => click('button'),
                    expected: ['link', 'Index - Search', ''],
                },
                {
                    name: 'Search Button (Clicked, With query)',
                    action: async () => {
                        await fillIn('input', 'My Query');
                        await click('button');
                    },
                    expected: ['link', 'Index - Search', 'My Query'],
                },
                {
                    name: 'Search Button (Submitted)',
                    action: async () => triggerKeyEvent('input', 'keydown', 13),
                    expected: ['link', 'Index - Search', ''],
                },
                {
                    name: 'Search Button (Submitted, With query)',
                    action: async () => {
                        await fillIn('input', 'My Query');
                        await triggerKeyEvent('input', 'keydown', 13);
                    },
                    expected: ['link', 'Index - Search', 'My Query'],
                },
                {
                    name: 'See Example',
                    action: async () => click(
                        `.${HeaderStyles.RegistriesHeader} a`,
                    ),
                    expected: [
                        'link',
                        'Index - See Example',
                        'https://osf.io/jsznk/register/565fb3678c5e4a66b5582f67',
                        sinon.match.any,
                    ],
                },
                {
                    name: 'Browse Recent (id = 1)',
                    action: async () => click('[data-test-recent-registration-id="1"]'),
                    expected: [
                        'link',
                        'Index - Browse Recent: Can Potatoes Cause Cancer?',
                        'https://example.com/cancer-potatoes',
                    ],
                },
                {
                    name: 'Browse Recent (id = 2)',
                    action: async () => click('[data-test-recent-registration-id="2"]'),
                    expected: [
                        'link',
                        'Index - Browse Recent: Can Potatoes Cure Cancer?',
                        'https://example.com/super-potatoes',
                    ],
                },
                {
                    name: 'GitHub Repo',
                    action: async () => click(
                        `a.${ServiceListStyles.ServicesList__ExternalLink}:first-child`,
                    ),
                    expected: [
                        'link',
                        'Index - GitHub Repo',
                        'https://github.com/CenterForOpenScience/ember-osf-registries',
                        sinon.match.any,
                    ],
                },
                {
                    name: 'Requirements and Roadmap',
                    action: async () => click(
                        `a.${ServiceListStyles.ServicesList__ExternalLink}:last-child`,
                    ),
                    expected: [
                        'link',
                        'Index - Requirements and Roadmap',
                        // tslint:disable-next-line:max-line-length
                        'https://docs.google.com/spreadsheets/d/1SocElbBjc_Nhme4-SJv2_zytBd1ys8R5aZDb3POe94c/edit#gid=331732182', // eslint-disable-line max-len
                        sinon.match.any,
                    ],
                },
                {
                    name: 'Contact Us',
                    action: async () => click('a.btn.btn-info.btn-lg'),
                    expected: [
                        'link',
                        'Index - Contact',
                        sinon.match.any,
                    ],
                },
            ];

        assert.expect(testCases.length * 3);
        const engine = this.owner.lookup('-engine-instance:registries-registries') as EngineInstance;
        const stub = engine.lookup('service:analytics').click;

        for (const testCase of testCases) {
            stub.reset();
            stub.callsFake(function(this: Analytics, ...args: any[]) {
                const event = args[args.length - 1] as MouseEvent;
                // Prevent redirects from being followed
                if (!event.preventDefault) {
                    return true;
                }

                event.preventDefault();
                return false;
            });

            await visit('/registries');

            await testCase.action();

            assert.ok(true, testCase.name);
            sinon.assert.calledOnce(stub);
            sinon.assert.calledWith(stub, ...testCase.expected);
        }
    });
});
