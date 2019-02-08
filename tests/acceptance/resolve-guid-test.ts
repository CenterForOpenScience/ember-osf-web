import Service from '@ember/service';
import { currentRouteName, currentURL, settled } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupApplicationTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

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
}

module('Acceptance | resolve-guid', hooks => {
    setupApplicationTest(hooks);
    setupMirage(hooks);

    test('User | Index', async assert => {
        const user = server.create('user');

        await visit(`/${user.id}`);

        assert.expect(3);
        routingAssertions(assert, '--user', `/${user.id}`, 'guid-user.index');
    });

    test('File | Index', async assert => {
        const file = server.create('file', { user: server.create('user') });

        await visit(`/${file.id}`);

        assert.expect(3);
        routingAssertions(assert, '--file', `/${file.id}`, 'guid-file');
    });

    module('Node', mhooks => {
        mhooks.beforeEach(async function(this: TestContext) {
            const analyticsEngine = await loadEngine('analytics-page', 'guid-node.analytics');
            analyticsEngine.register('service:keen', KeenStub);
        });

        test('Index', async assert => {
            const node = server.create('node');

            await visit(`/${node.id}`);

            assert.expect(3);
            routingAssertions(assert, '--node', `/${node.id}`, 'guid-node.index');
        });

        test('Forks', async assert => {
            const node = server.create('node');

            await visit(`/${node.id}/forks`);

            assert.expect(3);
            routingAssertions(assert, '--node', `/${node.id}/forks`, 'guid-node.forks');
        });

        test('Analytics', async assert => {
            const node = server.create('node');

            await visit(`/${node.id}/analytics`);

            assert.expect(3);
            routingAssertions(assert, '--node', `/${node.id}/analytics`, 'guid-node.analytics.index');
        });

        test('Registrations', async assert => {
            const node = server.create('node');

            await visit(`/${node.id}/registrations`);

            assert.expect(3);
            routingAssertions(assert, '--node', `/${node.id}/registrations`, 'guid-node.registrations');
        });
    });

    module('Registration', mhooks => {
        mhooks.beforeEach(async function(this: TestContext) {
            const analyticsEngine = await loadEngine('analytics-page', 'guid-registration.analytics');
            analyticsEngine.register('service:keen', KeenStub);
        });

        module('No ember_registries_detail_page', __ => {
            test('Index', async assert => {
                server.create('root', 'oldRegistrationDetail');
                const reg = server.create('registration');

                await visit(`/${reg.id}`);

                assert.expect(3);
                routingAssertions(assert, '--registration', `/${reg.id}`, 'guid-registration.index');
            });

            test('Forks', async assert => {
                server.create('root', 'oldRegistrationDetail');
                const reg = server.create('registration', { currentUserPermissions: ['admin'] });

                await visit(`/${reg.id}/forks`);

                assert.expect(3);
                routingAssertions(assert, '--registration', `/${reg.id}/forks`, 'guid-registration.forks');
            });

            test('Analytics', async assert => {
                server.create('root', 'oldRegistrationDetail');
                const reg = server.create('registration', { currentUserPermissions: ['admin'] });

                const url = `/${reg.id}/analytics`;

                await visit(url);

                assert.expect(3);
                routingAssertions(assert, '--registration', url, 'guid-registration.analytics.index');
            });
        });

        module('With ember_registries_detail_page', __ => {
            test('Index', async assert => {
                const reg = server.create('registration');

                await visit(`/${reg.id}`);

                assert.expect(3);
                routingAssertions(assert, '--registries', `/${reg.id}`, 'registries.overview.index');
            });

            test('Forks', async assert => {
                const reg = server.create('registration', { currentUserPermissions: ['admin'] });

                await visit(`/${reg.id}/forks`);

                assert.expect(3);
                routingAssertions(assert, '--registration', `/${reg.id}/forks`, 'guid-registration.forks');
            });

            test('Analytics', async assert => {
                const reg = server.create('registration', { currentUserPermissions: ['admin'] });

                const url = `/${reg.id}/analytics`;

                await visit(url);

                assert.expect(3);
                routingAssertions(assert, '--registration', url, 'guid-registration.analytics.index');
            });
        });
    });

    test('Not found', async assert => {
        const testCases = [
            { url: '/decaf', test: 'Nonexistant GUID' },
            { url: '/decaf/files', test: 'Nonexistant GUID with existing sub route' },
            { url: '/decaf/blah/blah/blah', test: 'Nonexistant GUID with non-existing sub route' },
            { url: '/decaf?tastes-like=dirt', test: 'GUID with query params' },
            { url: '/decaf/files?cream=1', test: 'GUID and subpath with query params' },
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
