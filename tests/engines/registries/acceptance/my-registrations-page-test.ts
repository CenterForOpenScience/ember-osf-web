import { click, currentURL } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
import { registerNodeMultiple } from 'ember-osf-web/mirage/helpers';

module('Registries | Acceptance | my-registrations page', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    test('navigation with drafts and registrations', async assert => {
        const contributorUser = server.create('user', 'loggedIn');
        const node = server.create('node', 'currentUserAdmin');
        server.create('contributor', { node, users: contributorUser });

        server.loadFixtures('schema-blocks');
        server.loadFixtures('registration-schemas');
        const registrationSchema = server.schema.registrationSchemas.all().models[0];
        registerNodeMultiple(server, node, 3, { registrationSchema }, 'withArbitraryState');

        server.createList('draft-registration', 2);

        await visit('/registries/my-registrations');
        assert.dom('[data-test-my-registrations-sort-description]').exists('Sort description shown');
        assert.notOk(currentURL().includes('tab'), 'Tab query param not visible on submitted');
        assert.dom('[data-test-my-registrations-nav="submitted"]').hasClass('active', 'Submitted tab is active');
        assert.dom('[data-test-my-registrations-nav="drafts"]').doesNotHaveClass('active', 'Draft tab is not active');
        assert.dom('[data-test-my-registrations-pane="submitted"]').isVisible('Submitted pane is shown');
        assert.dom('[data-test-my-registrations-pane="drafts"]').isNotVisible('Drafts pane is not shown');
        assert.dom('[data-test-node-card]').exists({ count: 3 }, 'All submitted registrations shown');
        await percySnapshot(assert);

        await click('[data-test-my-registrations-nav-button="drafts"]');
        assert.ok(currentURL().includes('tab=drafts'), 'Tab query param visible on drafts');
        assert.dom('[data-test-my-registrations-nav="drafts"]').hasClass('active', 'Drafts tab is active');
        assert.dom('[data-test-my-registrations-nav="submitted"]').doesNotHaveClass('active',
            'Submitted tab is not active');
        assert.dom('[data-test-my-registrations-pane="drafts"]').isVisible('Drafts pane is shown');
        assert.dom('[data-test-my-registrations-pane="submitted"]').isNotVisible('Submitted pane is not shown');
        assert.dom('[data-test-draft-registration-card]').exists({ count: 2 }, 'All drafts shown');
        await percySnapshot(
            'Registries | Acceptance | my registrations page | navigation with drafts and registrations | drafts',
        );
    });
});
