import { click as untrackedClick, fillIn, visit } from '@ember/test-helpers';

import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { selectChoose } from 'ember-power-select/test-support';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

module('Acceptance | Guid User Quickfiles', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('visiting another\'s guid-user/quickfiles unauthenticated', async function(assert) {
        server.create('root', { currentUser: null });
        const user = server.create('user', 'withFiles');
        assert.ok(this.element === undefined, 'Should not have element before visit');
        await visit(`--user/${user.id}/quickfiles`);
        assert.ok(this.element !== undefined, 'Should have element after visit');
        assert.dom('nav.navbar').exists();
        assert.dom('nav.navbar .service-name').hasText('OSF HOME');
        assert.dom('nav.navbar .secondary-nav-dropdown').doesNotExist('Should not have user menu if not logged in');
        const files = this.element.querySelectorAll('[data-test-file-item-link]');
        assert.equal(files.length, 5, `Check for proper number of files in list. Found ${files.length}`);
    });

    test('visiting another\'s guid-user/quickfiles authenticated', async function(assert) {
        const currentUser = server.create('user', 'loggedIn');
        const user = server.create('user', 'withFiles');
        server.createList('file', 5, { user });
        await visit(`--user/${user.id}/quickfiles`);
        assert.dom('nav.navbar').exists();
        assert.dom('nav.navbar .service-name').hasText('OSF HOME');
        assert.dom('nav.navbar .secondary-nav-dropdown .nav-profile-name')
            .hasText(currentUser.fullName, 'User\'s name is in navbar');
        const files = this.element.querySelectorAll('[data-test-file-item-link]');
        assert.equal(files.length, 10, `Check for proper number of files in list. Found ${files.length}`);
        await percySnapshot(assert);
    });

    test('visiting your guid-user/quickfiles authenticated', async function(assert) {
        const currentUser = server.create('user', 'loggedIn');
        const user = server.create('user', 'withFiles');
        server.createList('file', 5, { user });
        await visit(`--user/${currentUser.id}/quickfiles`);
        const files = this.element.querySelectorAll('[data-test-file-item-link]');
        assert.equal(files.length, 5, `Check for proper number of files in list. Found ${files.length}`);
    });

    test('move file to a new project', async function(assert) {
        const currentUser = server.create('user', 'loggedIn');
        const title = 'Giraffical Interchange Format';
        server.loadFixtures('regions');
        await visit(`--user/${currentUser.id}/quickfiles`);
        const files = this.element.querySelectorAll('div[class*="file-browser-item"]');
        assert.equal(files.length, 5, `Check for proper number of files in list. Found ${files.length}`);
        await untrackedClick(files[0]);
        await click('[data-test-move-button]');
        await percySnapshot('Acceptance | Guid User Quickfiles | move file to a new project | Move');
        await click('[data-test-ps-new-project-button]');
        assert.dom('[data-test-create-project-header]').includesText('Create new project');
        await fillIn('[data-test-new-project-title]', title);
        await percySnapshot('Acceptance | Guid User Quickfiles | move file to a new project | New project');
        await click('[data-test-create-project-submit]');
        await percySnapshot('Acceptance | Guid User Quickfiles | move file to a new project | Create project');
        await click('[data-test-stay-here]');
        const newFiles = this.element.querySelectorAll('div[class*="file-browser-item"]');
        assert.equal(newFiles.length, files.length - 1);
        const newNode = server.schema.nodes.findBy({ title });
        assert.equal(newNode.attrs.public, true, 'Projects created from quickfiles should be public.');
    });

    test('create new and cancel', async function(assert) {
        const title = 'Giraffical Interchange Format';
        const currentUser = server.create('user', 'loggedIn');
        server.loadFixtures('regions');
        await visit(`--user/${currentUser.id}/quickfiles`);
        const files = this.element.querySelectorAll('div[class*="file-browser-item"]');
        assert.equal(files.length, 5, `Check for proper number of files in list. Found ${files.length}`);
        await untrackedClick(files[0]);
        await click('[data-test-move-button]');
        await click('[data-test-ps-new-project-button]');
        await fillIn('[data-test-new-project-title]', title);
        assert.dom('[data-test-new-project-title]').hasValue(title);
        await click('[data-analytics-name="cancel"]');
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
        await visit(`--user/${currentUser.id}/quickfiles`);
        const files = this.element.querySelectorAll('div[class*="file-browser-item"]');
        assert.equal(files.length, 5, `Check for proper number of files in list. Found ${files.length}`);
        await untrackedClick(files[0]);
        await click('[data-test-move-button]');
        await click('[data-test-ps-new-project-button]');
        await fillIn('[data-test-new-project-title]', title);
        assert.dom('[data-test-new-project-title]').hasValue(title);
        await click('[data-analytics-name="cancel"]');
        await untrackedClick(files[1]);
        await click('[data-test-move-button]');
        await click('[data-test-ps-new-project-button]');
        assert.dom('[data-test-new-project-title]')
            .hasNoValue('Should not be filled out after leaving and re-entering');
    });

    test('move file to an existing public project', async function(assert) {
        const currentUser = server.create('user', 'loggedIn');
        server.loadFixtures('regions');
        const title = 'Giraffical Interchange Format';
        const node = server.create(
            'node',
            { title, lastLogged: '2017-10-19T12:05:10.571Z', dateModified: '2017-10-19T12:05:10.571Z', public: true },
        );
        server.create(
            'contributor',
            { node, users: currentUser, index: 0, permission: 'admin', bibliographic: true },
        );
        await visit(`--user/${currentUser.id}/quickfiles`);
        const files = this.element.querySelectorAll('div[class*="file-browser-item"]');
        assert.equal(files.length, 5, `Check for proper number of files in list. Found ${files.length}`);
        await untrackedClick(files[0]);
        await click('[data-test-move-button]');
        await click('[data-test-ps-existing-project-button]');
        await untrackedClick('[data-test-ps-select-project] div[class*="ember-power-select-trigger"]');
        await selectChoose('[data-test-ps-select-project]', title);
        assert.dom('[data-test-ps-select-project] span[class~="ember-power-select-selected-item"]')
            .containsText(title);
        assert.dom('[data-test-no-longer-public]')
            .doesNotExist('There should not be a warning about moving files to a private project');
        await percySnapshot(assert);
        await click('[data-test-move-to-project-modal-perform-button]');
        await click('[data-test-stay-here]');
        const newFiles = this.element.querySelectorAll('div[class*="file-browser-item"]');
        assert.equal(newFiles.length, files.length - 1);
    });

    test('move file to an existing private project', async function(assert) {
        const currentUser = server.create('user', 'loggedIn');
        server.loadFixtures('regions');
        const title = 'Giraffical Interchange Format';
        const node = server.create(
            'node',
            { title, lastLogged: '2017-10-19T12:05:10.571Z', dateModified: '2017-10-19T12:05:10.571Z', public: false },
        );
        server.create(
            'contributor',
            { node, users: currentUser, index: 0, permission: 'admin', bibliographic: true },
        );
        await visit(`--user/${currentUser.id}/quickfiles`);
        assert.dom('img[alt*="Missing translation"]').doesNotExist();
        const files = this.element.querySelectorAll('div[class*="file-browser-item"]');
        assert.equal(files.length, 5, `Check for proper number of files in list. Found ${files.length}`);
        await untrackedClick(files[0]);
        await click('[data-test-move-button]');
        await click('[data-test-ps-existing-project-button]');
        await untrackedClick('[data-test-ps-select-project] div[class*="ember-power-select-trigger"]');
        await selectChoose('[data-test-ps-select-project]', title);
        assert.dom('[data-test-ps-select-project] span[class~="ember-power-select-selected-item"]')
            .containsText(title);
        assert.dom('[data-test-no-longer-public]')
            .exists('Should be a warning about moving files to a private project');
        assert.dom('[data-test-no-longer-public]')
            .containsText('Files moved to private projects will no longer be public or discoverable by others.');
        await click('[data-test-move-to-project-modal-perform-button]');
        await click('[data-test-stay-here]');
        const newFiles = this.element.querySelectorAll('div[class*="file-browser-item"]');
        assert.equal(newFiles.length, files.length - 1);
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
        await visit(`--user/${currentUser.id}/quickfiles`);
        const files = this.element.querySelectorAll('div[class*="file-browser-item"]');
        assert.equal(files.length, 5, `Check for proper number of files in list. Found ${files.length}`);
        await untrackedClick(files[0]);
        await click('[data-test-move-button]');
        await click('[data-test-ps-existing-project-button');
        assert.dom('[data-test-ps-select-project] span[class~="ember-power-select-selected-item"]')
            .doesNotExist();
        assert.dom('[data-test-ps-select-project]').exists();
        await untrackedClick('[data-test-ps-select-project] div[class*="ember-power-select-trigger"]');
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
        await visit(`--user/${currentUser.id}/quickfiles`);
        const files = this.element.querySelectorAll('div[class*="file-browser-item"]');
        assert.equal(files.length, 5, `Check for proper number of files in list. Found ${files.length}`);
        await untrackedClick(files[0]);
        await click('[data-test-move-button]');
        await click('[data-test-ps-existing-project-button');
        assert.dom('[data-test-ps-select-project] span[class~="ember-power-select-selected-item"]')
            .doesNotExist();
        assert.dom('[data-test-move-to-project-modal-perform-button]')
            .isDisabled('Should be disabled before selecting a project');
        assert.dom('[data-test-ps-select-project]').exists();
        await untrackedClick('[data-test-ps-select-project] div[class*="ember-power-select-trigger"]');
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

    test('misc screenshots for Percy', async function() {
        const currentUser = server.create('user', 'loggedIn');
        await visit(`--user/${currentUser.id}/quickfiles`);
        const files = this.element.querySelectorAll('div[class*="file-browser-item"]');
        await untrackedClick(files[0]);
        await click('[data-test-rename-button]');
        await percySnapshot('Acceptance | Guid User Quickfiles | rename button');
        await click('[data-test-close-rename]');
        await click('[data-test-filter-button]');
        await percySnapshot('Acceptance | Guid User Quickfiles | filter button');
        await click('[data-test-close-filter]');
        await click('[data-test-info-button]');
        await percySnapshot('Acceptance | Guid User Quickfiles | help button');
        await click('[data-test-close-current-modal]');
    });
});
