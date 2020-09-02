import { click, currentRouteName } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import Features from 'ember-feature-flags';
import config from 'ember-get-config';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

module('Registries | Acceptance | branded.new', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    hooks.beforeEach(() => {
        server.create('user', 'loggedIn');
    });

    test('serves branded.new route if provider.allowSubmissions: true', async assert => {
        const brandedProvider = server.create('registration-provider', 'withBrand');
        await visit(`/registries/${brandedProvider.id}/new`);
        await percySnapshot(assert);

        assert.equal(currentRouteName(), 'registries.branded.new', 'At the correct route: branded.new');
    });

    test('redirects to page-not-found if provider.allowSubmissions: false', async assert => {
        const brandedProvider = server.create('registration-provider',
            'withBrand', 'submissionsNotAllowed');
        await visit(`/registries/${brandedProvider.id}/new`);
        assert.equal(currentRouteName(), 'registries.page-not-found', 'At the correct route: page-not-found');
    });

    test('only serves EGAP brand.new if egapAdmins feature flag is enabled', async function(assert) {
        const brandedProvider = server.create('registration-provider',
            { id: 'egap' }, 'withBrand');
        const { featureFlagNames: { egapAdmins } } = config;
        const features = this.owner.lookup('service:features') as Features;

        await visit(`/registries/${brandedProvider.id}/new`);
        assert.equal(currentRouteName(), 'registries.page-not-found', 'At the correct route: page-not-found');

        features.enable(egapAdmins);
        await visit(`/registries/${brandedProvider.id}/new`);
        assert.ok(features.isEnabled(egapAdmins), 'egapAdmins flag is enabled');
        assert.equal(currentRouteName(), 'registries.branded.new', 'At the correct route: EGAP branded.new');

        features.disable(egapAdmins);
        await visit(`/registries/${brandedProvider.id}/new`);
        assert.notOk(features.isEnabled(egapAdmins), 'egapAdmins flag is disabled');
        assert.equal(currentRouteName(), 'registries.page-not-found', 'At the correct route: page-not-found');
    });

    test('users are prevented from submitting incomplete form', async assert => {
        server.loadFixtures('registration-schemas');
        server.loadFixtures('schema-blocks');
        const currentUser = server.create('user', 'loggedIn');
        const node = server.create('node', { id: 'decaf', title: 'This is your project' }, 'currentUserAdmin');
        const nonAdminNode = server.create('node', { id: 'badmin', title: 'User is not admin' });
        server.create('contributor', { node, users: currentUser });
        server.create('contributor', { node: nonAdminNode, users: currentUser });
        const brandedProvider = server.create('registration-provider', 'withBrand', 'withSchemas');
        await visit(`/registries/${brandedProvider.id}/new`);

        assert.dom('[data-test-start-registration-button]')
            .isDisabled('Start registration button is disabled on first load');
        await click('[data-test-project-select] .ember-power-select-trigger');
        assert.dom('.ember-power-select-options > li.ember-power-select-option:first-of-type')
            .hasText('This is your project', 'Project dropdown shows project title');
        assert.dom('.ember-power-select-options > li.ember-power-select-option')
            .doesNotContainText('User is not admin', 'Project dropdown only shows projects the user is admin for');
        await click('.ember-power-select-options > li.ember-power-select-option:first-of-type');
        assert.dom('[data-test-schema-select] .ember-power-select-trigger')
            .hasText('This is a Test Schema', 'Schema dropdown is autopopulated with first schema available');
        assert.dom('[data-test-start-registration-button]')
            .isEnabled('Start registration button is enabled after choosing a project and schema');
        await click('[data-test-start-registration-button]');
        assert.equal(currentRouteName(), 'registries.drafts.draft.metadata',
            'Go to draft registration metadata page on start');
    });
});
