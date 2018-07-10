import { currentURL, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { module, test } from 'qunit';

module('Acceptance | dashboard', hooks => {
    setupApplicationTest(hooks);

    test('visiting /dashboard', async assert => {
        const currentUser = server.create('user');
        const nodes = server.createList('node', 10, {}, 'withContributors');
        server.loadFixtures('nodes');
        for (let i = 4; i < 10; i++) {
            server.create('contributor', { node: nodes[i], users: currentUser, index: 11 });
        }
        server.create('root', { currentUser });
        server.createList('institution', 20);

        await visit('/dashboard');

        assert.equal(currentURL(), '/dashboard');
        assert.found('nav.navbar');
        assert.hasText('nav.navbar .service-name', 'OSF HOME');
        assert.hasText('nav.navbar .secondary-nav-dropdown .nav-profile-name', currentUser.fullName);
    });
});
