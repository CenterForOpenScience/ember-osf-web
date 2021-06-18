import { click, currentRouteName } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
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
        const brandedProvider = server.create('registration-provider', {
            assets: {
                favicon: 'fakelink',
            },
        }, 'withBrand');
        await visit(`/registries/${brandedProvider.id}/new`);
        await percySnapshot(assert);
        assert.ok(document.querySelector('link[rel="icon"][href="fakelink"]'));
        assert.equal(currentRouteName(), 'registries.branded.new', 'At the correct route: branded.new');
    });

    test('serves branded.new route if provider.allowSubmissions: false and user is moderator',
        async assert => {
            const brandedProvider = server.create('registration-provider', {
                assets: {
                    favicon: 'fakelink',
                },
            }, 'withBrand', 'submissionsNotAllowed', 'currentUserIsModerator');
            await visit(`/registries/${brandedProvider.id}/new`);
            await percySnapshot(assert);
            assert.ok(document.querySelector('link[rel="icon"][href="fakelink"]'));
            assert.equal(currentRouteName(), 'registries.branded.new', 'At the correct route: branded.new');
        });

    test('redirects to page-not-found if provider.allowSubmissions: false and user not moderator', async assert => {
        const brandedProvider = server.create('registration-provider',
            'withBrand', 'submissionsNotAllowed');
        await visit(`/registries/${brandedProvider.id}/new`);
        assert.equal(currentRouteName(), 'registries.page-not-found', 'At the correct route: page-not-found');
    });

    test('users are prevented from submitting incomplete form with project', async assert => {
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
            .isNotDisabled('Start registration button is enabled on first load with schema selected');
        await click('[data-test-has-project-button]');
        assert.dom('[data-test-project-select]').exists();
        assert.dom('[data-test-start-registration-button]')
            .isDisabled('Start button is disabled without project selected');
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
    test('users are prevented from submitting incomplete form no project', async assert => {
        server.loadFixtures('registration-schemas');
        server.loadFixtures('schema-blocks');
        const brandedProvider = server.create('registration-provider', 'withBrand', 'withSchemas');
        await visit(`/registries/${brandedProvider.id}/new`);

        assert.dom('[data-test-start-registration-button]')
            .isNotDisabled('Start registration button is enabled on first load with schema selected');
        assert.dom('[data-test-project-select]').doesNotExist();
        assert.dom('[data-test-schema-select] .ember-power-select-trigger')
            .hasText('This is a Test Schema', 'Schema dropdown is autopopulated with first schema available');
        await click('[data-test-start-registration-button]');
        assert.equal(currentRouteName(), 'registries.drafts.draft.metadata',
            'Go to draft registration metadata page on start');
    });

    test('creating a no-project draft registration does not have any metadata', async assert => {
        server.loadFixtures('registration-schemas');
        server.loadFixtures('schema-blocks');
        const brandedProvider = server.create('registration-provider', 'withBrand', 'withSchemas');
        await visit(`/registries/${brandedProvider.id}/new`);
        await click('[data-test-no-project-button]');

        await click('[data-test-start-registration-button]');
        assert.equal(currentRouteName(), 'registries.drafts.draft.metadata',
            'Go to draft registration metadata page on start');
        assert.dom('[data-test-link-back-to-project]').doesNotExist('No link back to project');
        assert.dom('[data-test-metadata-title] input').hasValue('', 'Title is blank');
        assert.dom('[data-test-metadata-description] textarea').hasValue('', 'Description blank');
        assert.dom('[data-test-contributor-card-main]').exists({ count: 1 }, 'Only one contributor');
        assert.dom('[data-test-contributor-link]').exists({ count: 1 }, 'Only one contributor');
        assert.dom('[data-test-contributor-permission]').containsText('Administrator', 'user is admin');
        assert.dom('[data-test-contributor-citation]').containsText('Yes', 'user is bibliographic');
        assert.dom('[data-test-option="uncategorized"]').exists('Category is uncategorized by default');
    });
});
