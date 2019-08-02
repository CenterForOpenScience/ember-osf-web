import {
    click as untrackedClick,
    currentURL,
    fillIn,
    settled,
    triggerKeyEvent,
    visit,
} from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { selectChoose } from 'ember-power-select/test-support';
import moment from 'moment';
import { module, test } from 'qunit';

import { Permission } from 'ember-osf-web/models/osf-model';
import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';
import pathJoin from 'ember-osf-web/utils/path-join';

module('Acceptance | Guid User Quickfiles', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('visiting another\'s guid-user/quickfiles unauthenticated', async function(assert) {
        const user = server.create('user', 'withFiles');
        assert.ok(this.element === undefined, 'Should not have element before visit');
        await visit(`/--user/${user.id}/quickfiles`);
        assert.ok(
            this.element !== undefined,
            'Should have element after visit (guid routing / visit helper problem)',
        );
        assert.dom('nav.navbar').exists();
        assert.dom('nav.navbar .service-name').hasText('OSF HOME');
        assert.dom('nav.navbar .secondary-nav-dropdown').doesNotExist('Should not have user menu if not logged in');
        const files = this.element.querySelectorAll('[data-test-file-item-link]');
        assert.equal(files.length, 5, `Check for proper number of files in list. Found ${files.length}`);
    });

    test('visiting another\'s guid-user/quickfiles authenticated', async function(assert) {
        const currentUser = server.create('user', 'loggedIn', 'withFiles');
        const user = server.create('user', 'withFiles');
        server.createList('file', 5, { user });
        await visit(`/--user/${user.id}/quickfiles`);
        assert.dom('nav.navbar').exists();
        assert.dom('nav.navbar .service-name').hasText('OSF HOME');
        assert.dom('nav.navbar .secondary-nav-dropdown .nav-profile-name')
            .hasText(currentUser.fullName, 'User\'s name is in navbar');
        const files = this.element.querySelectorAll('[data-test-file-item-link]');
        assert.equal(files.length, 10, `Check for proper number of files in list. Found ${files.length}`);
        await percySnapshot(assert);
    });

    test('visiting your guid-user/quickfiles authenticated', async assert => {
        const currentUser = server.create('user', 'loggedIn', 'withFiles');
        const user = server.create('user', 'withFiles');
        server.createList('file', 5, { user });
        await visit(`/--user/${currentUser.id}/quickfiles`);
        assert.dom('[data-test-file-item-link]').exists({ count: 5 });
    });

    module('Move to project', () => {
        test('move file to a new project', async function(assert) {
            const currentUser = server.create('user', 'loggedIn', 'withFiles');
            const title = 'Giraffical Interchange Format';
            server.loadFixtures('regions');

            await visit(`/--user/${currentUser.id}/quickfiles`);
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

        test('create new project and cancel', async function(assert) {
            const title = 'Giraffical Interchange Format';
            const currentUser = server.create('user', 'loggedIn', 'withFiles');
            server.loadFixtures('regions');

            await visit(`/--user/${currentUser.id}/quickfiles`);
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
            const currentUser = server.create('user', 'loggedIn', 'withFiles');
            server.loadFixtures('regions');

            await visit(`/--user/${currentUser.id}/quickfiles`);
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
            const currentUser = server.create('user', 'loggedIn', 'withFiles');
            server.loadFixtures('regions');
            const title = 'Giraffical Interchange Format';
            const node = server.create(
                'node',
                {
                    title,
                    lastLogged: '2017-10-19T12:05:10.571Z',
                    dateModified: '2017-10-19T12:05:10.571Z',
                    public: true,
                },
            );
            server.create(
                'contributor',
                { node, users: currentUser, index: 0, permission: Permission.Admin, bibliographic: true },
            );

            await visit(`/--user/${currentUser.id}/quickfiles`);
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
            const currentUser = server.create('user', 'loggedIn', 'withFiles');
            server.loadFixtures('regions');
            const title = 'Giraffical Interchange Format';
            const node = server.create(
                'node',
                {
                    title,
                    lastLogged: '2017-10-19T12:05:10.571Z',
                    dateModified: '2017-10-19T12:05:10.571Z',
                    public: false,
                },
            );
            server.create(
                'contributor',
                {
                    node,
                    users: currentUser,
                    index: 0,
                    permission: Permission.Admin,
                    bibliographic: true,
                },
            );

            await visit(`/--user/${currentUser.id}/quickfiles`);
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
            const currentUser = server.create('user', 'loggedIn', 'withFiles');
            const node = server.create(
                'node',
                { title, lastLogged: '2017-10-19T12:05:10.571Z', dateModified: '2017-10-19T12:05:10.571Z' },
            );
            server.create(
                'contributor',
                { node, users: currentUser, index: 0, permission: Permission.Admin, bibliographic: true },
            );
            server.loadFixtures('regions');

            await visit(`/--user/${currentUser.id}/quickfiles`);
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
            const currentUser = server.create('user', 'loggedIn', 'withFiles');
            const node = server.create(
                'node',
                { title, lastLogged: '2017-10-19T12:05:10.571Z', dateModified: '2017-10-19T12:05:10.571Z' },
            );
            server.create(
                'contributor',
                { node, users: currentUser, index: 0, permission: Permission.Admin, bibliographic: true },
            );
            server.loadFixtures('regions');

            await visit(`/--user/${currentUser.id}/quickfiles`);
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
    });

    module('File browser', () => {
        test('displays appropriate information', async assert => {
            const currentUser = server.create('user', 'loggedIn');
            const file = server.create('file', {
                name: 'Xyzzyplugh.gif',
                dateModified: '2016-08-07T16:43:18.319Z',
                guid: 'xyzzy',
                currentVersion: 7,
                extra: {
                    downloads: 42,
                },
                user: currentUser,
            });
            const date = moment('2016-08-07T16:43:18.319Z').format('YYYY-MM-DD h:mm A');

            await visit(`/--user/${currentUser.id}/quickfiles`);
            assert.dom('[data-test-file-item-link]').exists({ count: 1 });
            assert.dom('[data-test-file-icon-and-name]:first-child i')
                .hasClass('fa-file-image-o');
            assert.dom(`[data-test-file-icon-and-name] a[href="/${file.guid}"]`)
                .exists();
            assert.dom('[data-test-version-link]')
                .containsText('7');
            assert.dom('[data-test-version-link]')
                .containsText('7');
            assert.dom('[data-test-download-count]')
                .containsText('42');
            assert.dom('[data-test-date-modified]')
                .hasText(date);
        });

        test('can delete a file', async assert => {
            const currentUser = server.create('user', 'loggedIn', 'withFiles');

            await visit(`/--user/${currentUser.id}/quickfiles`);
            assert.dom('[data-test-file-item-link]').exists({ count: 5 }, 'initial state');

            await untrackedClick('[data-test-file-icon-and-name]');
            assert.dom('[data-test-delete-file-button]').exists('after select file');

            await click('[data-test-delete-file-button]');
            assert.dom('[data-test-delete-modal]').exists('after click delete');
            percySnapshot(assert);

            await click('[data-test-delete-file-cancel-button]');
            assert.dom('[data-test-delete-file-cancel-button]').doesNotExist('after cancel button');
            assert.dom('[data-test-delete-file-button]').exists('after cancel button');

            await click('[data-test-delete-file-button]');
            assert.dom('[data-test-delete-file-confirm-button]').exists('after click delete');

            await click('[data-test-delete-file-confirm-button]');
            assert.dom('[data-test-delete-file-cancel-button]').doesNotExist('after confirm delete');
            assert.dom('[data-test-delete-file-button]').doesNotExist('after confirm delete');
            assert.dom('[data-test-file-item-link]').exists({ count: 4 }, 'after confirm delete');
        });

        test('can rename a file', async assert => {
            const currentUser = server.create('user', 'loggedIn');
            const file = server.create('file', {
                name: 'Xyzzyplugh.gif',
                user: currentUser,
            });

            await visit(`/--user/${currentUser.id}/quickfiles`);
            assert.dom('[data-test-file-item-link]')
                .exists({ count: 1 }, 'initial state');
            assert.dom('[data-test-file-item-link]')
                .containsText(file.name, 'before rename');
            await untrackedClick('[data-test-file-icon-and-name]');
            assert.dom('[data-test-rename-file-button]').exists('after select file');

            await click('[data-test-rename-file-button]');
            assert.dom('[data-test-rename-field]').exists('after clicking rename the first time');
            await percySnapshot(assert);
            assert.dom('[data-test-rename-field]')
                .hasAttribute('placeholder', file.name, 'Placeholder after clicking rename the first time');
            await fillIn('[data-test-rename-field]', 'plughxyzzy.txt');

            await click('[data-test-close-rename]');
            assert.dom('[data-test-rename-field]').doesNotExist('after closing rename');
            assert.dom('[data-test-rename-file-button]').exists('after closing rename');

            await click('[data-test-rename-file-button]');
            assert.dom('[data-test-rename-field]').exists('after clicking rename again');
            assert.dom('[data-test-rename-field]')
                .hasAttribute('placeholder', file.name, 'Placeholder after clicking rename again');
            await fillIn('[data-test-rename-field]', 'plughxyzzy.txt');

            await click('[data-test-save-rename]');
            assert.dom('[data-test-rename-file-button]').exists('after rename');
            assert.dom('[data-test-file-item-link]')
                .exists({ count: 1 }, 'initial state');
            assert.dom('[data-test-file-item-link]')
                .containsText('plughxyzzy.txt', 'after rename');
        });

        test('can rename a file with conflicting name', async assert => {
            const currentUser = server.create('user', 'loggedIn');
            const fileOne = server.create(
                'file',
                {
                    name: 'xyzzy.gif',
                    user: currentUser,
                },
            );
            const fileTwo = server.create(
                'file',
                {
                    name: 'plugh.gif',
                    user: currentUser,
                },
            );

            await visit(`/--user/${currentUser.id}/quickfiles`);
            assert.dom('[data-test-file-item-link]')
                .exists({ count: 2 }, 'initial state');
            assert.dom('[data-test-file-item-link]')
                .containsText(fileTwo.name, 'initial state');
            assert.dom('[data-test-conflict-keep-both-button]')
                .doesNotExist('initial state');
            await untrackedClick(`[data-test-file-icon-and-name="${fileTwo.name}"]`);

            await click('[data-test-rename-file-button]');
            assert.dom('[data-test-rename-field]').exists('after clicking rename');
            await fillIn('[data-test-rename-field]', fileOne.name);

            await click('[data-test-save-rename]');
            assert.dom('[data-test-conflict-keep-both-button]')
                .exists('First rename conflict attempt');
            await percySnapshot(assert);

            await click('[data-test-conflict-keep-both-button]');
            assert.dom('[data-test-file-item-link]')
                .exists({ count: 2 }, 'after keeping both');
            assert.dom('[data-test-file-item-link]')
                .containsText(fileTwo.name, 'after keeping both');

            await click('[data-test-rename-file-button]');
            assert.dom('[data-test-rename-field]').exists('after clicking rename again');
            await fillIn('[data-test-rename-field]', fileOne.name);

            await click('[data-test-save-rename]');
            assert.dom('[data-test-conflict-replace-file-button]')
                .exists('second rename conflict attempt');

            await click('[data-test-conflict-replace-file-button]');
            assert.dom('[data-test-file-item-link]')
                .exists({ count: 1 }, 'after replacing');
            assert.dom('[data-test-file-item-link]')
                .containsText(fileOne.name, 'after replacing');
            assert.dom('[data-test-conflict-replace-file-button]')
                .doesNotExist('after replacing');
        });

        test('can share a file', async assert => {
            const currentUser = server.create('user', 'loggedIn');
            const file = server.create(
                'file',
                {
                    guid: 'xyzzy',
                    name: 'Xyzzyplugh.gif',
                    user: currentUser,
                },
            );
            await visit(`/--user/${currentUser.id}/quickfiles`);
            assert.dom('[data-test-file-item-link]').exists({ count: 1 });

            await untrackedClick(`[data-test-file-icon-and-name="${file.name}"]`);
            await click('[data-test-share-dialog-button]');
            assert.dom('[data-test-share-dialog-button]')
                .exists('after clicking share');
            assert.dom('[data-test-file-share-copyable-text]')
                .exists('after clicking share');
            assert.dom('[data-test-file-share-copyable-text] input')
                .hasValue(pathJoin(window.location.origin, file.guid));
            assert.dom('[data-test-file-share-copyable-text] span[class*="input-group-btn"]')
                .exists('after clicking share');

            await untrackedClick('[data-test-file-share-copyable-text] span[class*="input-group-btn"] button');
            assert.dom('[data-test-file-share-copyable-text]')
                .doesNotExist('after clicking copy');
            assert.dom('[data-test-share-dialog-button]')
                .exists('after clicking copy');

            await click('[data-test-share-dialog-button]');
            assert.dom('[data-test-file-share-copyable-text]')
                .exists('Should disappear when clicking on share button again');
            await click('[data-test-share-dialog-button]');
            assert.dom('[data-test-file-share-copyable-text]')
                .doesNotExist('Should disappear when clicking on share button again');

            await click('[data-test-share-dialog-button]');
            assert.dom('[data-test-file-share-copyable-text]')
                .exists('Should disappear when clicking on another action button');
            await click('[data-test-rename-file-button]');
            assert.dom('[data-test-file-share-copyable-text]')
                .doesNotExist('Should disappear when clicking on another action button');
        });

        test('can view a file', async assert => {
            const currentUser = server.create('user', 'loggedIn');
            const file = server.create(
                'file',
                {
                    guid: 'xyzzy',
                    name: 'Xyzzyplugh.gif',
                    user: currentUser,
                },
            );
            await visit(`/--user/${currentUser.id}/quickfiles`);
            assert.dom('[data-test-file-item-link]').exists({ count: 1 });

            await untrackedClick(`[data-test-file-icon-and-name="${file.name}"]`);
            assert.dom('[data-test-view-button]').exists();
            await click('[data-test-view-button]');
            assert.equal(currentURL(), '/xyzzy');
            await visit(`/--user/${currentUser.id}/quickfiles`);
            await click('[data-test-file-item-link]');
            assert.equal(currentURL(), '/xyzzy');
        });

        test('can filter files', async assert => {
            const currentUser = server.create('user', 'loggedIn');
            server.create(
                'file',
                {
                    name: 'aa.gif',
                    user: currentUser,
                },
            );
            server.create(
                'file',
                {
                    name: 'az.gif',
                    user: currentUser,
                },
            );
            server.create(
                'file',
                {
                    name: 'za.gif',
                    user: currentUser,
                },
            );
            server.create(
                'file',
                {
                    name: 'zz.gif',
                    user: currentUser,
                },
            );

            await visit(`/--user/${currentUser.id}/quickfiles`);
            assert.dom('[data-test-file-item-link]').exists({ count: 4 }, 'initial setup');

            await click('[data-test-filter-button]');
            assert.dom('[data-test-filter-input]').exists('after clicking filter');
            percySnapshot(assert);

            fillIn('[data-test-filter-input]', 'a');
            triggerKeyEvent('[data-test-filter-input]', 'keyup', 'Shift');
            await settled();
            assert.dom('[data-test-file-item-link]').exists({ count: 3 }, 'filter for a');

            fillIn('[data-test-filter-input]', 'z');
            triggerKeyEvent('[data-test-filter-input]', 'keyup', 'Shift');
            await settled();
            assert.dom('[data-test-file-item-link]').exists({ count: 3 }, 'filter for z');

            fillIn('[data-test-filter-input]', 'az');
            triggerKeyEvent('[data-test-filter-input]', 'keyup', 'Shift');
            await settled();
            assert.dom('[data-test-file-item-link]').exists({ count: 1 }, 'filter for az');

            fillIn('[data-test-filter-input]', 'aa');
            triggerKeyEvent('[data-test-filter-input]', 'keyup', 'Shift');
            await settled();
            assert.dom('[data-test-file-item-link]').exists({ count: 1 }, 'filter for aa');

            fillIn('[data-test-filter-input]', 'zz');
            triggerKeyEvent('[data-test-filter-input]', 'keyup', 'Shift');
            await settled();
            assert.dom('[data-test-file-item-link]').exists({ count: 1 }, 'filter for zz');
        });

        test('can sort files', async assert => {
            const currentUser = server.create('user', 'loggedIn');
            server.create(
                'file',
                {
                    name: 'aa.gif',
                    dateModified: '2015-08-07T16:43:18.319Z',
                    user: currentUser,
                },
            );
            server.create(
                'file',
                {
                    name: 'az.gif',
                    dateModified: '2017-08-07T16:43:18.319Z',
                    user: currentUser,
                },
            );
            server.create(
                'file',
                {
                    name: 'za.gif',
                    dateModified: '2014-08-07T16:43:18.319Z',
                    user: currentUser,
                },
            );
            server.create(
                'file',
                {
                    name: 'zz.gif',
                    dateModified: '2016-08-07T16:43:18.319Z',
                    user: currentUser,
                },
            );

            await visit(`/--user/${currentUser.id}/quickfiles`);
            assert.dom('[data-test-file-item-link]').exists({ count: 4 }, 'initial setup');
            assert.dom('[data-test-file-item-link]').hasText('aa.gif', 'initial setup');

            click('[data-test-descending-sort="name"]');
            await settled();
            assert.dom('[data-test-file-item-link]').hasText('zz.gif', 'click descending by name');

            click('[data-test-ascending-sort="name"]');
            await settled();
            assert.dom('[data-test-file-item-link]').hasText('aa.gif', 'click ascending by name');

            click('[data-test-ascending-sort="dateModified"]');
            await settled();
            assert.dom('[data-test-file-item-link]').hasText('za.gif', 'click ascending by modified');

            click('[data-test-descending-sort="dateModified"]');
            await settled();
            assert.dom('[data-test-file-item-link]').hasText('az.gif', 'click descending by modified');
        });
    });

    test('Help button works', async assert => {
        const currentUser = server.create('user', 'loggedIn', 'withFiles');
        await visit(`/--user/${currentUser.id}/quickfiles`);
        await click('[data-test-info-button]');
        await percySnapshot(assert);
        await click('[data-test-close-current-modal]');
    });
});
