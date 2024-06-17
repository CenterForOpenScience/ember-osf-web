import { currentURL, fillIn, triggerKeyEvent, visit } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';
import { TestContext } from 'ember-test-helpers';
import { CredentialsFormat, TermsOfServiceCapabilities } from 'ember-osf-web/models/external-service';

module('Acceptance | settings | addons', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        const currentUser = server.create('user', 'loggedIn');
        server.create('user-reference', { id: currentUser.id });
        const boxAddon = server.create('external-storage-service',
            {
                id: 'box',
                displayName: 'Box',
                credentialsFormat: CredentialsFormat.OAUTH2,
                termsOfService: [
                    TermsOfServiceCapabilities.ADD_UPDATE_FILES,
                    TermsOfServiceCapabilities.DELETE_FILES,
                    TermsOfServiceCapabilities.FORKING,
                    TermsOfServiceCapabilities.LOGS,
                    TermsOfServiceCapabilities.PERMISSIONS,
                    TermsOfServiceCapabilities.REGISTERING,
                    TermsOfServiceCapabilities.FILE_VERSIONS,
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
                termsOfService: [
                    TermsOfServiceCapabilities.FORKING_PARTIAL,
                    TermsOfServiceCapabilities.PERMISSIONS_PARTIAL,
                ],
                iconUrl: 'https://osf.io/static/addons/mendeley/comicon.png',
            });
        server.create('authorized-storage-account', {
            displayName: 'My Box Account',
            scopes: ['write'],
            externalStorageService: boxAddon,
            accountOwner: currentUser,
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

    test('It can start OAuth flow', async function(assert) {
        await visit('/settings/addons');

        await click('[data-test-provider-connect-button="Box"]');
        assert.dom('[data-test-capabilities-table]')
            .containsText('Adding/updating files within OSF will be reflected in Box.');

        await click('[data-test-addon-terms-confirm-button]');
        await fillIn('[data-test-oauth-display-name-input]', 'My Box Addon');
        await click('[data-test-addon-oauth-button]');
        assert.dom('#toast-container', document as any).hasTextContaining('The OAuth window was blocked.',
            'Toast error shown after failing to open OAuth window');
    });

    test('It can connect a non-OAuth addon', async function(assert) {
        server.create('external-storage-service',
            {
                id: 'owncloud',
                displayName: 'ownCloud',
                credentialsFormat: CredentialsFormat.URL_USERNAME_PASSWORD,
                termsOfService: [
                    TermsOfServiceCapabilities.ADD_UPDATE_FILES,
                    TermsOfServiceCapabilities.DELETE_FILES,
                    TermsOfServiceCapabilities.FORKING,
                    TermsOfServiceCapabilities.LOGS,
                    TermsOfServiceCapabilities.PERMISSIONS,
                    TermsOfServiceCapabilities.REGISTERING,
                ],
                configurableApiRoot: true,
                readOnly: false,
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
        assert.dom('[data-test-connected-accounts-tab]').containsText('My ownCloud Account');
    });

});
