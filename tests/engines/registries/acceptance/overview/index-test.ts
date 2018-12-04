import Service from '@ember/service';
import { click, currentRouteName } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import { currentURL, visit } from 'ember-osf-web/tests/helpers';
import { loadEngine, setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

const KeenStub = Service.extend({
    queryNode(model: any) {
        return {
            result: [{
                'page.info.path': `/${model.id}/foo`,
            }],
        };
    },
});

module('Registries | Acceptance | overview.index', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        server.create('root', { currentUser: null });
    });

    test('it renders', async function(this: TestContext, assert: Assert) {
        const registration = server.create('registration', 'withRegisteredMeta');

        await visit(`/${registration.id}/`);
        await percySnapshot(assert);

        assert.equal(currentURL(), `/${registration.id}/`, 'At the guid URL');
        assert.equal(currentRouteName(), 'registries.overview.index', 'At the expected route');
    });

    test('sidenav links', async function(this: TestContext, assert: Assert) {
        const analyticsEngine = await loadEngine('analytics-page', 'guid-registration.analytics');

        analyticsEngine.register('service:keen', KeenStub);

        const registration = server.create('registration');

        const testCases = [{
            name: 'comments',
            route: 'registries.overview.comments',
            url: `/--registries/${registration.id}/comments`,
        }, {
            name: 'analytics',
            route: 'guid-registration.analytics.index',
            url: `/--registration/${registration.id}/analytics`,
        }, {
            name: 'components',
            route: 'registries.overview.children',
            url: `/--registries/${registration.id}/components`,
        }, {
            name: 'links',
            route: 'registries.overview.links',
            url: `/--registries/${registration.id}/links`,
        }];

        for (const testCase of testCases) {
            await visit(`/${registration.id}/`);

            await click(`[data-test-link="${testCase.name}"]`);
            await percySnapshot(`Registries sidenav - ${testCase.name}`);

            assert.equal(currentURL(), testCase.url, 'At the correct URL');
            assert.equal(currentRouteName(), testCase.route, 'At the correct route');
        }
    });

    test('sidenav hrefs', async function(this: TestContext, assert: Assert) {
        const registration = server.create('registration');

        const testCases = [{
            selector: '[data-test-link="files"]',
            href: `/${registration.id}/files/`,
        }, {
            selector: '[data-test-link="wiki"]',
            href: `/${registration.id}/wiki/`,
        }];

        for (const testCase of testCases) {
            await visit(`/${registration.id}/`);

            assert.dom(testCase.selector).hasAttribute('href', testCase.href, 'Non-ember routes have the correct href');
        }
    });
});
