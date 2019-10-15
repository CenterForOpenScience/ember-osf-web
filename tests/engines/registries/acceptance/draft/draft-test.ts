import Service from '@ember/service';
import { currentRouteName, currentURL } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

const currentUserStub = Service.extend();
const sessionStub = Service.extend({
    isAuthenticated: true,
});
const storeStub = Service.extend();
const analyticsStub = Service.extend();

module('Registries | Acceptance | draft form', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.owner.register('service:currentUser', currentUserStub);
        this.owner.register('service:session', sessionStub);
        this.owner.register('service:store', storeStub);
        this.owner.register('service:analytics', analyticsStub);
    });

    test('it redirects to first page of the schema\'d form', async assert => {
        server.loadFixtures('schema-blocks');
        server.loadFixtures('registration-schemas');

        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration', { registrationSchema, initiator },
        );

        await visit(`/registries/drafts/${registration.id}/`);

        assert.ok(currentURL().includes(`/registries/drafts/${registration.id}/1-`), 'At first schema page');
        assert.equal(currentRouteName(), 'registries.drafts.draft', 'At the expected route');
    });

    test('it redirects page-not-found if the pageIndex route param is out of range', async assert => {
        server.loadFixtures('schema-blocks');
        server.loadFixtures('registration-schemas');

        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration', { registrationSchema, initiator },
        );

        await visit(`/registries/drafts/${registration.id}/99/`);

        assert.equal(currentRouteName(), 'registries.page-not-found', 'At page not found');
    });
});
