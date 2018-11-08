import Service from '@ember/service';
import { click, currentRouteName } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { currentURL, visit } from 'ember-osf-web/tests/helpers';
import { loadEngine, setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

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
        const registration = server.create('registration');

        await visit(`/${registration.id}/`);

        assert.equal(currentURL(), `/${registration.id}/`, 'At the guid URL');
        assert.equal(currentRouteName(), 'registries.overview.index', 'At the expected route');
    });

    test('sidenav links', async function(this: TestContext, assert: Assert) {
        const analyticsEngine = await loadEngine('analytics-page', 'guid-registration.analytics');

        analyticsEngine.register('service:keen', KeenStub);

        const registration = server.create('registration');

        const testCases = [{
            selector: '[data-test-link="comments"]',
            route: 'registries.overview.comments',
            url: `/${registration.id}/comments`,
        }, {
            selector: '[data-test-link="analytics"]',
            route: 'guid-registration.analytics.index',
            url: `/${registration.id}/analytics`,
        }];

        for (const testCase of testCases) {
            await visit(`/${registration.id}/`);

            await click(testCase.selector);

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

    test('sidenav components', async function(this: TestContext, assert: Assert) {
        const registration = server.create('registration');
        const components = server.createList('registration', 15, { parent: registration }).sort().reverse();

        await visit(`/${registration.id}/`);
        await click('[data-test-link="components"]');

        for (const component of components.slice(0, 10)) {
            assert.dom(`[data-test-link="components"] + ul a[data-test-id="${component.id}"]`).hasText(
                (component as any).title,
            );
        }

        for (const component of components.slice(10)) {
            assert.dom(`[data-test-link="components"] + ul a[data-test-id="${component.id}"]`).doesNotExist();
        }

        await click('[data-test-show-more="children"]');

        for (const component of components) {
            assert.dom(`[data-test-link="components"] + ul a[data-test-id="${component.id}"]`).hasText(
                (component as any).title,
            );
        }
    });

    test('sidenav links', async function(this: TestContext, assert: Assert) {
        const selector = (id: string | number) => `[data-test-link="links"] + ul a[data-test-id="${id}"]`;

        const registration = server.create('registration', {
            linkedNodes: server.createList('node', 11),
            linkedRegistrations: server.createList('registration', 11),
        });

        const links = registration.linkedNodes.models.sort().reverse().concat(
            registration.linkedRegistrations.models.sort().reverse(),
        );

        await visit(`/${registration.id}/`);
        await click('[data-test-link="links"]');

        for (let i = 10; i < (links.length + 10); i += 10) {
            for (const node of links.slice(0, i)) {
                assert.dom(selector(node.id)).hasText((node as any).title);
            }

            for (const node of links.slice(i)) {
                assert.dom(selector(node.id)).doesNotExist();
            }

            if (i < links.length) {
                await click('[data-test-show-more="links"]');
            } else {
                assert.dom('[data-test-show-more="links"]').doesNotExist();
            }
        }
    });
});
