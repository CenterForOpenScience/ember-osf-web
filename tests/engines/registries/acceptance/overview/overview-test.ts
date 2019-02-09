import { ModelInstance } from 'ember-cli-mirage';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import Registration from 'ember-osf-web/models/registration';
import RegistrationSchema from 'ember-osf-web/models/registration-schema';

import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

interface OverviewTestContext extends TestContext {
    registration: ModelInstance<Registration>;
}

module('Registries | Acceptance | overview.overview', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    hooks.beforeEach(function(this: OverviewTestContext) {
        server.loadFixtures('registration-schemas');
        const registration = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find<RegistrationSchema>('prereg_challenge'),
            embargoed: true,
        });

        this.set('registration', registration);
    });

    test('admin can view embargoed registration',
        async function(this: OverviewTestContext, assert: Assert) {
            this.registration.update({ currentUserPermissions: ['admin'] });

            await visit(`/${this.registration.id}/`);

            assert.dom('[data-test-banner="embargoed"]').isVisible();
            assert.dom('[data-test-registration-title]').isVisible();
        });

    test('non-admin contrib can view embargoed registration',
        async function(this: OverviewTestContext, assert: Assert) {
            this.registration.update({
                currentUserPermissions: ['admin'],
            });

            await visit(`/${this.registration.id}/`);

            assert.dom('[data-test-banner="embargoed"]').isVisible();
            assert.dom('[data-test-registration-title]').isVisible();
        });

    test('non-contrib user cannot view embargoed registration',
        async function(this: OverviewTestContext, assert: Assert) {
            this.registration.update({ currentUserPermissions: [] });

            try {
                await visit(`/${this.registration.id}/`);
            } catch (e) {
                assert.equal(e.errors.length, 1);
                assert.equal(e.errors[0].detail, 'Not found.');
            }
        });

    test('logged out user cannot view embargoed registration',
        async function(this: OverviewTestContext, assert: Assert) {
            try {
                await visit(`/${this.registration.id}/`);
            } catch (e) {
                assert.equal(e.errors.length, 1);
                assert.equal(e.errors[0].detail, 'Not found.');
            }
        });
});
