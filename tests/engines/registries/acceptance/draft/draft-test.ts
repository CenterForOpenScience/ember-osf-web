import Service from '@ember/service';
import { click, currentRouteName, currentURL } from '@ember/test-helpers';
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

function getHrefAttribute(selector: string) {
    return document.querySelector(selector)!.getAttribute('href');
}

module('Registries | Acceptance | draft form', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.owner.register('service:currentUser', currentUserStub);
        this.owner.register('service:session', sessionStub);
        this.owner.register('service:store', storeStub);
        this.owner.register('service:analytics', analyticsStub);

        server.loadFixtures('schema-blocks');
        server.loadFixtures('registration-schemas');
    });

    test('it redirects to first page of the schema\'d form', async assert => {
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
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration', { registrationSchema, initiator },
        );

        await visit(`/registries/drafts/${registration.id}/99/`);

        assert.equal(currentRouteName(), 'registries.page-not-found', 'At page not found');
    });

    test('right saidenav controls', async assert => {
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create(
            'draft-registration', { registrationSchema, initiator },
        );

        await visit(`/registries/drafts/${registration.id}/`);

        assert.ok(currentURL().includes(`/registries/drafts/${registration.id}/1-`), 'At first schema page');

        assert.dom('[data-test-goto-previous-page]').doesNotExist();
        assert.dom('[data-test-goto-review]').doesNotExist();
        assert.dom('[data-test-goto-register]').doesNotExist();

        assert.dom('[data-test-goto-next-page]').isVisible();
        assert.ok(getHrefAttribute('[data-test-goto-next-page]')!
            .includes(`/registries/drafts/${registration.id}/2-`));

        await click('[data-test-goto-next-page]');

        // Last page
        assert.ok(currentURL().includes(`/registries/drafts/${registration.id}/2-`), 'At second (last) page');
        assert.dom('[data-test-goto-register]').doesNotExist();
        assert.dom('[data-test-goto-next-page]').doesNotExist();

        assert.dom('[data-test-goto-previous-page]').isVisible();
        assert.ok(getHrefAttribute('[data-test-goto-previous-page]')!
            .includes(`/registries/drafts/${registration.id}/1-`));

        assert.dom('[data-test-goto-review]').isVisible();
        assert.ok(getHrefAttribute('[data-test-goto-review]')!
            .includes(`/registries/drafts/${registration.id}/review`));

        await click('[data-test-goto-review]');

        // review page
        assert.ok(currentURL().includes(`/registries/drafts/${registration.id}/review`), 'At review page');
        assert.dom('[data-test-read-only-response]').exists();

        assert.dom('data-test-goto-next-page').doesNotExist();
        assert.dom('[data-test-goto-review]').doesNotExist();

        assert.dom('[data-test-goto-register]').isVisible();
        assert.dom('[data-test-goto-previous-page]').isVisible();

        // Can navigate back to the last page from review page
        await click('[data-test-goto-previous-page]');
        assert.ok(currentURL().includes(`/registries/drafts/${registration.id}/2-`), 'At second (last) page');
    });
});
