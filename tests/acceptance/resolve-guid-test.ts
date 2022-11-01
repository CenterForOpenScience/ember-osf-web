import Transition from '@ember/routing/-private/transition';
import Service from '@ember/service';
import { currentRouteName, currentURL, settled } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import config from 'ember-get-config';
import { setupApplicationTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';
import sinon from 'sinon';

import { Permission } from 'ember-osf-web/models/osf-model';
import { currentURL as currentLocationURL, visit } from 'ember-osf-web/tests/helpers';
import { loadEngine } from 'ember-osf-web/tests/helpers/engines';

const KeenStub = Service.extend({
    queryNode(model: any) {
        return {
            result: [{
                'page.info.path': `/${model.id}/foo`,
            }],
        };
    },
});

const routeWillChangeStub = sinon.stub();

function routingAssertions(assert: Assert, segment: string, url: string, route: string) {
    assert.equal(currentURL(), `/${segment}${url}`, `The "real" URL contains the hidden "${segment}" segment`);
    assert.equal(currentLocationURL(), url, 'The Location URL is the same');
    assert.equal(currentRouteName(), route, 'The correct route was reached');

    assert.ok(
        routeWillChangeStub.args.any(
            ([t]: [Transition]) => t.targetName === route,
        ),
        `The router checked for a feature flag for "${route}"`,
    );
}

module('Acceptance | resolve-guid', hooks => {
    setupApplicationTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        const router = this.owner.lookup('service:router');
        router.on('routeWillChange', routeWillChangeStub);
    });

    module('File', __ => {
        test('Index', async assert => {
            const file = server.create('file', { target: server.create('registration') });

            await visit(`/${file.id}`);

            routingAssertions(assert, '--file', `/${file.id}`, 'guid-file.index');
        });
        test('Metadata', async assert => {
            const file = server.create('file', { target: server.create('registration') });

            await visit(`/${file.id}/metadata`);

            routingAssertions(assert, '--file', `/${file.id}/metadata`, 'guid-file.metadata');
        });
    });


    module('Node', mhooks => {
        mhooks.beforeEach(async () => {
            const analyticsEngine = await loadEngine('analytics-page', 'guid-node.analytics');
            analyticsEngine.register('service:keen', KeenStub);
        });

        test('Index', async assert => {
            const node = server.create('node');

            await visit(`/${node.id}`);

            routingAssertions(assert, '--node', `/${node.id}`, 'guid-node.index');
        });

        test('Forks', async assert => {
            const node = server.create('node');

            await visit(`/${node.id}/forks`);

            routingAssertions(assert, '--node', `/${node.id}/forks`, 'guid-node.forks');
        });

        test('Analytics', async assert => {
            const node = server.create('node');

            await visit(`/${node.id}/analytics`);

            routingAssertions(assert, '--node', `/${node.id}/analytics`, 'guid-node.analytics.index');
        });

        test('Registrations', async assert => {
            const { defaultProvider } = config;

            server.create('registration-provider', {
                id: defaultProvider,
                shareSource: 'OSF Registries',
                name: 'OSF Registries',
            });
            const node = server.create('node');

            await visit(`/${node.id}/registrations`);

            routingAssertions(assert, '--node', `/${node.id}/registrations`, 'guid-node.registrations');
        });

        test('Metadata', async assert => {
            const node = server.create('node');

            await visit(`/${node.id}/metadata`);

            routingAssertions(assert, '--node', `/${node.id}/metadata`, 'guid-node.metadata');
        });
    });

    module('Registration', mhooks => {
        mhooks.beforeEach(async () => {
            const analyticsEngine = await loadEngine('analytics-page', 'guid-registration.analytics');
            analyticsEngine.register('service:keen', KeenStub);
        });

        module('No ember_registries_detail_page', __ => {
            test('Index', async assert => {
                server.create('root', 'oldRegistrationDetail');
                const reg = server.create('registration');

                await visit(`/${reg.id}`);

                routingAssertions(assert, '--registration', `/${reg.id}`, 'guid-registration.index');
            });

            test('Forks', async assert => {
                server.create('root', 'oldRegistrationDetail');
                const reg = server.create('registration', { currentUserPermissions: [Permission.Admin] });

                await visit(`/${reg.id}/forks`);

                routingAssertions(assert, '--registration', `/${reg.id}/forks`, 'guid-registration.forks');
            });

            test('Analytics', async assert => {
                server.create('root', 'oldRegistrationDetail');
                const reg = server.create('registration', { currentUserPermissions: [Permission.Admin] });

                const url = `/${reg.id}/analytics`;

                await visit(url);

                routingAssertions(assert, '--registration', url, 'guid-registration.analytics.index');
            });
        });

        module('With ember_registries_detail_page', __ => {
            test('Index', async assert => {
                const reg = server.create('registration');

                await visit(`/${reg.id}`);

                routingAssertions(assert, '--registries', `/${reg.id}`, 'registries.overview.index');
            });

            test('Forks', async assert => {
                const reg = server.create('registration', { currentUserPermissions: [Permission.Admin] });

                await visit(`/${reg.id}/forks`);

                routingAssertions(assert, '--registration', `/${reg.id}/forks`, 'guid-registration.forks');
            });

            test('Analytics', async assert => {
                const reg = server.create('registration', { currentUserPermissions: [Permission.Admin] });

                const url = `/${reg.id}/analytics`;

                await visit(url);

                routingAssertions(assert, '--registration', url, 'guid-registration.analytics.index');
            });

            test('Metadata', async assert => {
                const reg = server.create('registration', { currentUserPermissions: [Permission.Admin] });

                await visit(`/${reg.id}/metadata`);

                routingAssertions(assert, '--registries', `/${reg.id}/metadata`, 'registries.overview.metadata');
            });
        });
    });

    test('Not found', async assert => {
        const testCases = [
            { url: '/decaf', test: 'Nonexistent GUID' },
            { url: '/decaf/blah/blah/blah', test: 'Nonexistent GUID with nonexistent sub route' },
        ];

        assert.expect(6 * testCases.length);

        for (const testCase of testCases) {
            try {
                await visit(testCase.url);
            } catch (e) {
                assert.equal(e.errors.length, 1);
                assert.equal(e.errors[0].detail, 'Not found.');
            }

            await settled();
            assert.ok(true, testCase.test);
            // TODO: look into why view_only query-param is getting appended to urls
            assert.ok(currentURL().includes(testCase.url), 'The URL has not changed');
            assert.ok(currentLocationURL().includes(testCase.url), 'The URL has not changed');
            assert.equal(currentRouteName(), 'not-found', 'The correct route was reached');
        }
    });
});
