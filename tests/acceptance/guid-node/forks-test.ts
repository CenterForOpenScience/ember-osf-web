import { currentRouteName } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { forkNode } from 'ember-osf-web/mirage/helpers';
import { click, currentURL, setupOSFApplicationTest, visit } from 'ember-osf-web/tests/helpers';

import { Permission } from 'ember-osf-web/models/osf-model';

module('Acceptance | guid-node/forks', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('logged out, no forks', async assert => {
        const node = server.create('node', { id: 'f0rk5', currentUserPermissions: [] });
        const url = `/${node.id}/forks`;

        await visit(url);
        assert.equal(currentURL(), url, `We are on ${url}`);
        assert.equal(currentRouteName(), 'guid-node.forks', 'We are at guid-node.forks');
        await percySnapshot(assert);
        assert.dom('[data-test-new-fork-button]').doesNotExist();
        assert.dom('[data-test-forks-info]')
            .hasText('Forks you have permission to view are shown here.');
    });

    test('logged out, 1 fork', async assert => {
        const title = 'Test Title';
        const node = server.create('node', { id: 'f0rk5', title });

        const fork = forkNode(
            server,
            node,
            {
                currentUserPermissions: Object.values(Permission),
            },
        );
        const contributorUser = server.create('user');
        server.create('contributor', { node: fork, users: contributorUser });

        const url = `/${node.id}/forks`;
        await visit(url);
        assert.equal(currentURL(), url, `We are on ${url}`);
        assert.dom('[data-test-new-fork-button]').doesNotExist();
        assert.dom('[data-test-node-card]').exists({ count: 1 });
        assert.dom('[data-test-node-card-heading]').includesText(title);
    });

    test('logged in admin, no forks', async assert => {
        server.create('user', 'loggedIn');
        const node = server.create('node', { id: 'f0rk5', currentUserPermissions: [Permission.Admin] });
        const url = `/${node.id}/forks`;

        await visit(url);
        assert.equal(currentURL(), url, `We are on ${url}`);
        assert.dom('[data-test-new-fork-button]').exists({ count: 1 });
        assert.dom('[data-test-forks-info]')
            .hasText('Forks you have permission to view are shown here.');
    });

    test('logged in admin, 1 fork', async assert => {
        const contributorUser = server.create('user', 'loggedIn');
        const node = server.create('node', {
            id: 'decaf',
            title: 'Test Title',
            currentUserPermissions: [Permission.Admin],
        });
        server.create('contributor', { node, users: contributorUser });
        const fork = forkNode(
            server,
            node,
            {
                currentUserPermissions: Object.values(Permission),
            },
        );
        const url = `/${node.id}/forks`;

        await visit(url);
        assert.equal(currentURL(), url, `We are on ${url}`);
        assert.dom('[data-test-new-fork-button]').exists({ count: 1 });
        assert.dom('[data-test-node-card]').exists({ count: 1 });
        assert.dom('[data-test-node-card-heading]').includesText(fork.title);
        assert.dom('[data-test-node-menu]').exists({ count: 1 });
    });

    test('logged in admin, 12 forks', async assert => {
        const contributorUser = server.create('user', 'loggedIn');
        const node = server.create('node', {
            id: 'f0rk5',
            title: 'Test Title',
            currentUserPermissions: [Permission.Admin],
        });
        server.create('contributor', { node, users: contributorUser });
        for (let i = 0; i < 12; i++) {
            forkNode(
                server,
                node,
                {
                    currentUserPermissions: Object.values(Permission),
                },
            );
        }
        const url = `/${node.id}/forks`;

        await visit(url);
        assert.equal(currentURL(), url, `We are on ${url}`);
        assert.dom('[data-test-new-fork-button]').exists({ count: 1 });
        assert.dom('[data-test-node-card]').exists({ count: 10 });
        assert.dom('[data-test-node-card]').includesText(node.title);
        await percySnapshot(assert);

        await click('[data-analytics-name="Pagination next"]');
        assert.dom('[data-test-node-card]').exists({ count: 2 });
        assert.dom('[data-test-node-card]').includesText(node.title);
    });

    test('logged in admin, new fork', async assert => {
        assert.expect(7);
        server.create('user', 'loggedIn');
        const node = server.create(
            'node',
            {
                id: 'f0rk5',
                currentUserPermissions: [Permission.Admin],
            },
        );
        const url = `/${node.id}/forks`;
        const done = assert.async();
        server.namespace = '/v2';
        server.post('/nodes/:parentID/forks', () => {
            assert.ok(true, 'Create forks called');
            done();
        });

        await visit(url);
        assert.equal(currentURL(), url, `We are on ${url}`);

        await click('[data-test-new-fork-button]');
        await percySnapshot(assert);
        assert.dom('[data-test-close-create-forks-modal]').exists();
        assert.dom('[data-test-new-fork-modal-body] h3').includesText('Are you sure');

        await click('[data-test-cancel-create-fork]');
        assert.dom('[data-test-new-fork-modal-body]').doesNotExist();

        await click('[data-test-new-fork-button]');
        assert.dom('[data-test-confirm-create-fork]').exists();
        await click('[data-test-confirm-create-fork]');
    });
});
