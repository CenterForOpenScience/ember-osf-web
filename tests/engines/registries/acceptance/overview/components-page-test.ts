import { setupMirage } from 'ember-cli-mirage/test-support';
import { module, test } from 'qunit';

import { Permission } from 'ember-osf-web/models/osf-model';
import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';


module('Registries | Acceptance | overview.components', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    test('With components', async assert => {
        const parentRegistration = server.create('registration');
        const childRegistration = server.create('registration', {
            currentUserPermissions: Object.values(Permission),
            title: 'Child registration',
        });
        const childRegistration2 = server.create('registration', {
            currentUserPermissions: Object.values(Permission),
            title: 'Child registration 2',
        });

        parentRegistration.update({
            children: [childRegistration, childRegistration2],
        });
        await visit(`/${parentRegistration.id}/components`);

        assert.dom('[data-test-node-card]').exists({ count: 2 }, 'Two child registrations are shown');
        assert.dom('[data-test-no-components]').doesNotExist('No components message is not shown');
    });

    test('Without components', async assert => {
        const registration = server.create('registration');
        await visit(`/${registration.id}/components`);

        assert.dom('[data-test-no-components]').exists('No components message is shown');
        assert.dom('[data-test-node-card]').doesNotExist('No child registrations are shown');
    });
});
