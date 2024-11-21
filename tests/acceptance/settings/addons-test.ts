import { currentURL, fillIn, triggerKeyEvent, visit } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';
import { TestContext } from 'ember-test-helpers';
import { CredentialsFormat, ExternalServiceCapabilities } from 'ember-osf-web/models/external-service';

module('Acceptance | settings | addons', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        const currentUser = server.create('user', 'loggedIn');
        const currentUserReference = server.create('user-reference', { id: currentUser.id });
        const boxAddon = server.create('external-storage-service',
            {
                id: 'box',
                displayName: 'Box',
                credentialsFormat: CredentialsFormat.OAUTH2,
                supportedFeatures: [
                    ExternalServiceCapabilities.ADD_UPDATE_FILES,
                    ExternalServiceCapabilities.DELETE_FILES,
                    ExternalServiceCapabilities.FORKING,
                    ExternalServiceCapabilities.LOGS,
                    ExternalServiceCapabilities.PERMISSIONS,
                    ExternalServiceCapabilities.REGISTERING,
                    ExternalServiceCapabilities.FILE_VERSIONS,
                ],
                configurableApiRoot: false,
                maxConcurrentDownloads: 1,
                maxUploadMb: 5,
                iconUrl: 'https://www.box.com/favicon.ico',
            });
        server.create('external-citation-service',
            {
                id: 'mendeley',
                displayName: 'Mendeley',
                credentialsFormat: CredentialsFormat.OAUTH2,
                supportedFeatures: [
                    ExternalServiceCapabilities.FORKING_PARTIAL,
                    ExternalServiceCapabilities.PERMISSIONS_PARTIAL,
                ],
                iconUrl: 'https://osf.io/static/addons/mendeley/comicon.png',
            });
        server.create('authorized-storage-account', {
            displayName: 'My Box Account',
            authorizedCapabilities: ['write'],
            externalStorageService: boxAddon,
            accountOwner: currentUserReference,
            credentialsAvailable: true,
        });
    });

    test('visit page', async function(assert) {
        await visit('/settings/addons');

        assert.equal(currentURL(), '/settings/addons', 'Went to the addons settings route.');
        await percySnapshot(assert);
    });

    test('Filter addons works',  async function(assert) {
        await visit('/settings/addons');

        assert.dom('[data-test-provider="Box"]').isVisible();
        assert.dom('[data-test-provider="Mendeley"]').isNotVisible();

        await click('[data-test-user-addon-list-filter="citation-manager"]');

        assert.dom('[data-test-provider="Box"]').isNotVisible();
        assert.dom('[data-test-provider="Mendeley"]').isVisible();

        await click('[data-test-user-addon-list-filter="cloud-computing"]');

        assert.dom('[data-test-provider="Box"]').isNotVisible();
        assert.dom('[data-test-provider="Mendeley"]').isNotVisible();
        assert.dom('[data-test-all-addons-tab]').containsText('No results found');
    });

    test('Connected account tab works', async function(assert) {
        await visit('/settings/addons');

        await click('[data-test-connected-accounts-tab-control]');
        assert.dom('[data-test-provider-list-item-name="My Box Account"]').exists();
    });

    test('It can connect, reconnect, and disconnect a non-OAuth addon', async function(assert) {
        server.create('external-storage-service',
            {
                id: 'owncloud',
                displayName: 'ownCloud',
                credentialsFormat: CredentialsFormat.USERNAME_PASSWORD,
                supportedFeatures: [
                    ExternalServiceCapabilities.ADD_UPDATE_FILES,
                    ExternalServiceCapabilities.DELETE_FILES,
                    ExternalServiceCapabilities.FORKING,
                    ExternalServiceCapabilities.LOGS,
                    ExternalServiceCapabilities.PERMISSIONS,
                    ExternalServiceCapabilities.REGISTERING,
                ],
                configurableApiRoot: true,
                maxConcurrentDownloads: 1,
                maxUploadMb: 5,
                iconUrl: 'https://owncloud.com/favicon.ico',
            });
        await visit('/settings/addons');

        await click('[data-test-provider-connect-button="ownCloud"]');
        await click('[data-test-addon-terms-confirm-button]');
        await fillIn('[data-test-display-name-input]', 'My ownCloud Addon');
        triggerKeyEvent('[data-test-display-name-input]', 'keyup', 'Shift');
        await fillIn('[data-test-input="url"]', 'https://server.owncloud.net/');
        triggerKeyEvent('[data-test-input="url"]', 'keyup', 'Shift');
        await fillIn('[data-test-input="username"]', 'Bob Username');
        triggerKeyEvent('[data-test-input="username"]', 'keyup', 'Shift');
        await fillIn('[data-test-input="password"]', 'password123');
        triggerKeyEvent('[data-test-input="password"]', 'keyup', 'Shift');
        await click('[data-test-addon-connect-account-button]');
        assert.dom('[data-test-provider-list-item-name="My ownCloud Addon"]').containsText('My ownCloud Addon');

        await click('[data-test-reconnect-account-button="My ownCloud Addon"]');
        await fillIn('[data-test-input="url"]', 'https://server.owncloud.com/');
        triggerKeyEvent('[data-test-input="url"]', 'keyup', 'Shift');
        await fillIn('[data-test-input="username"]', 'Robert Username');
        triggerKeyEvent('[data-test-input="username"]', 'keyup', 'Shift');
        await fillIn('[data-test-input="password"]', 'password123!');
        triggerKeyEvent('[data-test-input="password"]', 'keyup', 'Shift');
        await click('[data-test-addon-reconnect-account-button]');
        assert.dom('[data-test-provider-list-item-name="My ownCloud Addon"]').containsText('My ownCloud Addon');

        // eslint-disable-next-line max-len
        await click('[data-test-disconnect-account-button="My ownCloud Addon"] > [data-test-delete-button-secondary-destroy]');
        await click('[data-test-confirm-delete]');
        assert.dom('[data-test-provider-list-item-name="My ownCloud Addon"]').doesNotExist();
    });

});
