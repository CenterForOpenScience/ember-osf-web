import { click, currentURL, fillIn, visit } from '@ember/test-helpers';

import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { selectChoose } from 'ember-power-select/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Acceptance | Guid User Quickfiles', hooks => {
    setupApplicationTest(hooks);
    setupMirage(hooks);

    test('visiting another\'s guid-user/quickfiles unauthenticated', async function(assert) {
        server.create('root', { currentUser: null });
        const user = server.create('user', 'withFiles');
        await visit(`/${user.id}/quickfiles`);
        assert.equal(currentURL(), `/${user.id}/quickfiles`, 'We stayed on the proper page');
        assert.dom('nav.navbar').exists();
        assert.dom('nav.navbar .service-name').hasText('OSF HOME');
        assert.dom('nav.navbar .secondary-nav-dropdown').doesNotExist('Should not have user menu if not logged in');
        assert.dom('img[alt*="Missing translation"]').doesNotExist();
        const files = this.element.querySelectorAll('a[class*="filename"]');
        assert.equal(files.length, 5, `Check for proper number of files in list. Found ${files.length}`);
    });

    test('visiting another\'s guid-user/quickfiles authenticated', async function(assert) {
        const currentUser = server.create('user', 'loggedIn');
        const user = server.create('user', 'withFiles');
        server.createList('file', 5, { user });
        await visit(`/${user.id}/quickfiles`);
        assert.equal(currentURL(), `/${user.id}/quickfiles`, 'We stayed on the proper page');
        assert.dom('nav.navbar').exists();
        assert.dom('nav.navbar .service-name').hasText('OSF HOME');
        assert.dom('nav.navbar .secondary-nav-dropdown .nav-profile-name')
            .hasText(currentUser.fullName, 'User\'s name is in navbar');
        assert.dom('img[alt*="Missing translation"]').doesNotExist();
        const files = this.element.querySelectorAll('a[class*="filename"]');
        assert.equal(files.length, 10, `Check for proper number of files in list. Found ${files.length}`);
    });

    test('visiting your guid-user/quickfiles authenticated', async function(assert) {
        const currentUser = server.create('user', 'loggedIn');
        const user = server.create('user', 'withFiles');
        server.createList('file', 5, { user });
        await visit(`/${currentUser.id}/quickfiles`);
        assert.equal(currentURL(), `/${currentUser.id}/quickfiles`, 'We stayed on the proper page');
        assert.dom('img[alt*="Missing translation"]').doesNotExist();
        const files = this.element.querySelectorAll('a[class*="filename"]');
        assert.equal(files.length, 5, `Check for proper number of files in list. Found ${files.length}`);
    });

    test('move file to a new project', async function(assert) {
        const currentUser = server.create('user', 'loggedIn');
        server.loadFixtures('regions');
        await visit(`/${currentUser.id}/quickfiles`);
        assert.dom('img[alt*="Missing translation"]').doesNotExist();
        const files = this.element.querySelectorAll('div[class*="file-browser-item"]');
        assert.equal(files.length, 5, `Check for proper number of files in list. Found ${files.length}`);
        await click(files[0]);
        await click('[data-test-move-button]');
        await click('[data-test-ps-new-project-button]');
        assert.dom('[data-test-create-project-header]').includesText('Create new project');
        await fillIn('[data-test-new-project-title]', 'new project title');
        await click('[data-test-create-project-submit]');
        await click('[data-test-move-to-project-modal-perform-button]');
        await click('[data-test-stay-here]');
        const newFiles = this.element.querySelectorAll('div[class*="file-browser-item"]');
        assert.equal(newFiles.length, files.length - 1);
    });

    test('create new and cancel', async function(assert) {
        const title = 'Giraffical Interchange Format';
        const currentUser = server.create('user', 'loggedIn');
        server.loadFixtures('regions');
        await visit(`/${currentUser.id}/quickfiles`);
        const files = this.element.querySelectorAll('div[class*="file-browser-item"]');
        assert.equal(files.length, 5, `Check for proper number of files in list. Found ${files.length}`);
        await click(files[0]);
        await click('[data-test-move-button]');
        await click('[data-test-ps-new-project-button]');
        await fillIn('[data-test-new-project-title]', title);
        assert.dom('[data-test-new-project-title]').hasValue(title);
        await click('[data-test-create-project-cancel]');
        await click('[data-test-move-to-project-modal-close-button]');
        const newFiles = this.element.querySelectorAll('div[class*="file-browser-item"]');
        assert.equal(newFiles.length, 5, `Check for proper number of files in list. Found ${newFiles.length}`);
        await click('[data-test-move-button]');
        await click('[data-test-ps-new-project-button]');
        assert.dom('[data-test-new-project-title]')
            .hasNoValue('Should not be filled out after leaving and re-entering');
    });

    test('create new, cancel, and select new file [EMB-384]', async function(assert) {
        const title = 'Giraffical Interchange Format';
        const currentUser = server.create('user', 'loggedIn');
        server.loadFixtures('regions');
        await visit(`/${currentUser.id}/quickfiles`);
        const files = this.element.querySelectorAll('div[class*="file-browser-item"]');
        assert.equal(files.length, 5, `Check for proper number of files in list. Found ${files.length}`);
        await click(files[0]);
        await click('[data-test-move-button]');
        await click('[data-test-ps-new-project-button]');
        await fillIn('[data-test-new-project-title]', title);
        assert.dom('[data-test-new-project-title]').hasValue(title);
        await click('[data-test-create-project-cancel]');
        await click('[data-test-move-to-project-modal-close-button]');
        await click(files[1]);
        await click('[data-test-move-button]');
        await click('[data-test-ps-new-project-button]');
        assert.dom('[data-test-new-project-title]')
            .hasNoValue('Should not be filled out after leaving and re-entering');
    });

    test('Select existing project and back', async function(assert) {
        const title = 'Giraffical Interchange Format';
        const currentUser = server.create('user', 'loggedIn');
        const node = server.create(
            'node',
            { title, lastLogged: '2017-10-19T12:05:10.571Z', dateModified: '2017-10-19T12:05:10.571Z' },
        );
        server.create(
            'contributor',
            { node, users: currentUser, index: 0, permission: 'admin', bibliographic: true },
        );

        server.loadFixtures('regions');
        await visit(`/${currentUser.id}/quickfiles`);
        const files = this.element.querySelectorAll('div[class*="file-browser-item"]');
        assert.equal(files.length, 5, `Check for proper number of files in list. Found ${files.length}`);
        await click(files[0]);
        await click('[data-test-move-button]');
        await click('[data-test-ps-existing-project-button');
        assert.dom('[data-test-ps-select-project] span[class~="ember-power-select-selected-item"]')
            .doesNotExist();
        assert.dom('[data-test-ps-select-project]').exists();
        await click('[data-test-ps-select-project] div[class*="ember-power-select-trigger"]');
        await selectChoose('[data-test-ps-select-project]', title);
        assert.dom('[data-test-ps-select-project] span[class~="ember-power-select-selected-item"]')
            .containsText(title);
        await click('[data-test-move-to-project-modal-back-button]');
        await click('[data-test-ps-existing-project-button');
        assert.dom('[data-test-ps-select-project] span[class~="ember-power-select-selected-item"]')
            .doesNotExist();
    });

    test('Select existing project and cancel', async function(assert) {
        const title = 'Giraffical Interchange Format';
        const currentUser = server.create('user', 'loggedIn');
        const node = server.create(
            'node',
            { title, lastLogged: '2017-10-19T12:05:10.571Z', dateModified: '2017-10-19T12:05:10.571Z' },
        );
        server.create(
            'contributor',
            { node, users: currentUser, index: 0, permission: 'admin', bibliographic: true },
        );

        server.loadFixtures('regions');
        await visit(`/${currentUser.id}/quickfiles`);
        const files = this.element.querySelectorAll('div[class*="file-browser-item"]');
        assert.equal(files.length, 5, `Check for proper number of files in list. Found ${files.length}`);
        await click(files[0]);
        await click('[data-test-move-button]');
        await click('[data-test-ps-existing-project-button');
        assert.dom('[data-test-ps-select-project] span[class~="ember-power-select-selected-item"]')
            .doesNotExist();
        assert.dom('[data-test-move-to-project-modal-perform-button]')
            .isDisabled('Should be disabled before selecting a project');
        assert.dom('[data-test-ps-select-project]').exists();
        await click('[data-test-ps-select-project] div[class*="ember-power-select-trigger"]');
        await selectChoose('[data-test-ps-select-project]', title);
        assert.dom('[data-test-ps-select-project] span[class~="ember-power-select-selected-item"]')
            .containsText(title);
        assert.dom('[data-test-move-to-project-modal-perform-button]')
            .isNotDisabled('Should be enabled after selecting a project');
        await click('[data-test-move-to-project-modal-close-button]');
        await click('[data-test-move-button]');
        await click('[data-test-ps-existing-project-button');
        assert.dom('[data-test-ps-select-project] span[class~="ember-power-select-selected-item"]')
            .doesNotExist();
        assert.dom('[data-test-move-to-project-modal-perform-button]')
            .isDisabled('Should be disabled after leaving and re-entering');
    });
});
