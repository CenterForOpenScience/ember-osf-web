import Service from '@ember/service';
import { currentRouteName } from '@ember/test-helpers';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import Registration from 'ember-osf-web/models/registration';
import { click, currentURL, visit } from 'ember-osf-web/tests/helpers';
import { loadEngine, setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

interface OverviewTestContext extends TestContext {
    registration: ModelInstance<Registration>;
}

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

    hooks.beforeEach(function(this: OverviewTestContext) {
        server.loadFixtures('schema-blocks');
        server.loadFixtures('registration-schemas');
        server.create('user', 'loggedIn');
        this.set('registration', server.create('registration', {
            archiving: false,
            withdrawn: false,
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            provider: server.create('registration-provider'),
        }, 'withContributors', 'withFiles', 'currentUserAdmin'));
    });

    test('it renders', async function(this: OverviewTestContext, assert: Assert) {
        await visit(`/${this.registration.id}/`);
        await percySnapshot(assert);

        assert.equal(currentURL(), `/${this.registration.id}/`, 'At the guid URL');
        assert.equal(currentRouteName(), 'registries.overview.index', 'At the expected route');
    });

    test('sidenav links', async function(this: OverviewTestContext, assert: Assert) {
        const analyticsEngine = await loadEngine('analytics-page', 'guid-registration.analytics');

        analyticsEngine.register('service:keen', KeenStub);

        const testCases = [{
            name: 'Comments',
            route: 'registries.overview.comments',
            url: `/--registries/${this.registration.id}/comments`,
        }, {
            name: 'Analytics',
            route: 'guid-registration.analytics.index',
            url: `/--registration/${this.registration.id}/analytics`,
        }, {
            name: 'Components',
            route: 'registries.overview.children',
            url: `/--registries/${this.registration.id}/components`,
        }, {
            name: 'Links',
            route: 'registries.overview.links',
            url: `/--registries/${this.registration.id}/links`,
        }, {
            name: 'Files',
            route: 'registries.overview.files.provider',
            url: `/--registries/${this.registration.id}/files/osfstorage`,
        }];

        for (const testCase of testCases) {
            await visit(`/${this.registration.id}/`);

            await click(`[data-analytics-name="${testCase.name}"]`);
            await percySnapshot(`Registries sidenav - ${testCase.name}`);

            assert.equal(currentRouteName(), testCase.route, 'At the correct route');
        }
    });

    test('sidenav hrefs', async function(this: OverviewTestContext, assert: Assert) {
        const testCases = [{
            selector: '[data-test-wiki-link]',
            href: `/${this.registration.id}/wiki/`,
        }];

        for (const testCase of testCases) {
            await visit(`/${this.registration.id}/`);

            assert.dom(testCase.selector).hasAttribute('href', testCase.href, 'Non-ember routes have the correct href');
        }
    });

    test('wiki link hidden if wiki not enabled', async function(this: OverviewTestContext, assert: Assert){
        this.set('registration', server.create('registration', {
            archiving: false,
            withdrawn: false,
            wikiEnabled: false,
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            provider: server.create('registration-provider'),
        }, 'withContributors', 'currentUserAdmin'));

        await visit(`/${this.registration.id}`);

        assert.dom('[data-test-wiki-link]').doesNotExist('Wiki link hidden because wiki disabled');
    });

    test('withdrawn tombstone', async function(this: OverviewTestContext, assert: Assert) {
        this.set('registration', server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
        }, 'withContributors', 'currentUserAdmin', 'isWithdrawn'));
        const url = `/${this.registration.id}`;
        await visit(url);
        await percySnapshot(assert);

        assert.equal(currentURL(), url, 'At the correct URL');
        assert.dom('[data-test-registration-title]').hasText(this.registration.title, 'Correct title');
        assert.dom('[data-test-tombstone-title]').hasText(
            'This registration has been withdrawn for the reason(s) stated below.',
            'Correct tombstone title',
        );
    });

    test('archiving tombstone', async function(this: OverviewTestContext, assert: Assert) {
        this.set('registration', server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
        }, 'withContributors', 'currentUserAdmin', 'isArchiving'));
        const url = `/${this.registration.id}`;
        await visit(url);
        await percySnapshot(assert);

        assert.equal(currentURL(), url, 'At the correct URL');
        assert.dom('[data-test-registration-title]').hasText(this.registration.title, 'Correct title');
        assert.dom('[data-test-tombstone-title]').hasText(
            'This registration is currently archiving, and no changes can be made at this time.',
            'Correct tombstone title',
        );
    });
});
