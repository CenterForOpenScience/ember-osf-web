import { setupMirage } from 'ember-cli-mirage/test-support';
import { module, test } from 'qunit';

import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

module('Registries | Acceptance | overview.links', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    test('With linked node and no linked registration', async assert => {
        const registration = server.create('registration');
        const linkedNode = server.create('node', {
            title: 'Linked node',
        });

        registration.update({
            linkedNodes: [linkedNode],
        });
        await visit(`/${registration.id}/links`);
        assert.dom('[data-test-links-page-heading]').exists('Links page heading is shown');
        assert.dom(`[data-test-node-title="${linkedNode.id}"]`).containsText('Linked node', 'Linked node is shown');
        assert.dom('[data-test-no-linked-registrations]').exists('No linked registrations message is shown');
    });

    test('With linked registration and no linked node', async assert => {
        const registration = server.create('registration');
        const linkedRegistration = server.create('registration', {
            title: 'Linked registration',
        });

        registration.update({
            linkedRegistrations: [linkedRegistration],
        });
        await visit(`/${registration.id}/links`);

        assert.dom(`[data-test-node-title="${linkedRegistration.id}"]`)
            .containsText('Linked registration', 'Linked registration is shown');
        assert.dom('[data-test-no-linked-nodes]').exists('No linked nodes message is shown');
    });
});
