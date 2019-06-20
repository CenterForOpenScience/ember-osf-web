import Transition from '@ember/routing/-private/transition';
import Service from '@ember/service';
import { currentRouteName, currentURL, settled } from '@ember/test-helpers';
import { getContext } from '@ember/test-helpers/setup-context';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupApplicationTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';
import sinon, { SinonStub } from 'sinon';

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

function routingAssertions(assert: Assert, segment: string, url: string, route: string) {
    assert.equal(currentURL(), `/${segment}${url}`, `The "real" URL contains the hidden "${segment}" segment`);
    assert.equal(currentLocationURL(), url, 'The Location URL is the same');
    assert.equal(currentRouteName(), route, 'The correct route was reached');

    const router = (getContext() as TestContext).owner.lookup('router:main');
    const flagStub: SinonStub = router._beforeTransition;
    assert.ok(
        flagStub.args.any(
            ([t]: [Transition]) => t.targetName === route,
        ),
        `The router checked for a feature flag for "${route}"`,
    );
}

module('Acceptance | resolve-guid', hooks => {
    setupApplicationTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        const router = this.owner.lookup('router:main');
        sinon.stub(router, '_beforeTransition').returnsArg(0);
    });

    test('User | Index', async assert => {
        const user = server.create('user');

        await visit(`/${user.id}`);

        routingAssertions(assert, '--user', `/${user.id}`, 'guid-user.index');
    });

    test('File | Index', async assert => {
        const file = server.create('file', { user: server.create('user') });

        await visit(`/${file.id}`);

        routingAssertions(assert, '--file', `/${file.id}`, 'guid-file');
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
            const node = server.create('node');

            await visit(`/${node.id}/registrations`);

            routingAssertions(assert, '--node', `/${node.id}/registrations`, 'guid-node.registrations');
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
        });
    });

    test('Not found', async assert => {
        const testCases = [
            { url: '/decaf', test: 'Nonexistent GUID' },
            { url: '/decaf/files', test: 'Nonexistent GUID with existent sub route' },
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
            assert.equal(currentURL(), testCase.url, 'The URL has not changed');
            assert.equal(currentLocationURL(), testCase.url, 'The URL has not changed');
            assert.equal(currentRouteName(), 'not-found', 'The correct route was reached');
        }
    });
});
