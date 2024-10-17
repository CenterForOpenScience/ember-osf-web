import { click as untrackedClick, fillIn } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { click, currentURL, setupOSFApplicationTest, visit } from 'ember-osf-web/tests/helpers';
import { Permission } from 'ember-osf-web/models/osf-model';

import styles from 'ember-osf-web/guid-node/addons/index/styles';
import { ModelInstance } from 'ember-cli-mirage';
import ExternalStorageServiceModel from 'ember-osf-web/models/external-storage-service';


module('Acceptance | guid-node/addons', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: any) {
        server.loadFixtures('external-storage-services');
        server.loadFixtures('external-computing-services');
        server.loadFixtures('external-citation-services');
    });

    // test logged out workflow

    test('Filtering all providers; no configured addons', async function(assert) {
        const store = this.owner.lookup('service:store');
        const mirageUser = server.create('user', 'loggedIn');
        const mirageNode = server.create('node', { id: 'add0n', currentUserPermissions: [Permission.Admin] });
        const user = await store.findRecord('user', mirageUser.id);
        const node = await store.findRecord('node', mirageNode.id);
        server.create('user-reference', { userUri: user.links.self as string });
        server.create('resource-reference', { resourceUri: node.links.iri as string });
        const url = `/${node.id}/addons`;

        await visit(url);
        assert.equal(currentURL(), url, `We are on ${url}`);
        // eslint-disable-next-line max-len
        await percySnapshot('Acceptance | guid-node/addons | Filtering all providers; no configured addons | all addons tab');

        // Check all addons tab
        assert.dom('[data-test-addons-tab-all-addons]').exists('All addons tab is present');
        assert.dom('[data-test-addons-tab-connected-accounts]').exists('Connected accounts tab is present');
        assert.dom('[data-test-addons-tab-all-addons]')
            .hasAttribute('aria-selected', 'true', 'All addons tab is selected');

        // check additonal storage providers
        assert.dom('[data-test-addon-list-filter]').exists({ count: 3 }, '3 addon filters are present');
        assert.dom('[data-test-addon-list-filter="additional-storage"]')
            .hasClass(styles.active, 'Additional storage filter is active');
        assert.dom('[data-test-addon-card-connect]').exists({ count: 9 }, '9 storage addons are present');

        // Check citation-manager providers
        await click('[data-test-addon-list-filter="citation-manager"]');
        assert.dom('[data-test-addon-list-filter="citation-manager"]')
            .hasClass(styles.active, 'Additional computing filter is active');
        assert.dom('[data-test-addon-card-connect]').exists({ count: 2 }, '2 citation addons are present');

        // Check cloud-computing providers
        await click('[data-test-addon-list-filter="cloud-computing"]');
        assert.dom('[data-test-addon-list-filter="cloud-computing"]')
            .hasClass(styles.active, 'Additional citation filter is active');
        assert.dom('[data-test-addon-card-connect]').exists({ count: 1 }, '1 cloud computing addon is present');

        // Reset to additional storage
        await click('[data-test-addon-list-filter="additional-storage"]');

        // Filter by name
        await fillIn('[data-test-addon-list-filter-input]', 'Amazon');
        assert.dom('[data-test-addon-card-connect]').exists({ count: 1 }, '1 storage addon is present');
        await fillIn('[data-test-addon-list-filter-input]', 'box');
        assert.dom('[data-test-addon-card-connect]').exists({ count: 2 }, '2 storage addons present');

        // check connected accounts tab
        await click('[data-test-addons-tab-connected-accounts]');
        // eslint-disable-next-line max-len
        await percySnapshot('Acceptance | guid-node/addons | Filtering all providers; no configured addons | connected accounts tab');
        assert.dom('[data-test-addons-tab-connected-accounts]')
            .hasAttribute('aria-selected', 'true', 'Connected accounts tab is selected');
        assert.dom('[data-test-configured-provider-list]')
            .containsText('No results found', 'No connected accounts message is present');
    });


    test('Editing configured addons', async function(assert) {
        const store = this.owner.lookup('service:store');
        const mirageUser = server.create('user', 'loggedIn');
        const mirageNode = server.create('node', { id: 'add0n', currentUserPermissions: [Permission.Admin] });
        const user = await store.findRecord('user', mirageUser.id);
        const node = await store.findRecord('node', mirageNode.id);
        const userRef = server.create('user-reference', { userUri: user.links.self as string });
        const nodeRef = server.create('resource-reference', { resourceUri: node.links.iri as string });

        // create authorized account
        const box = server.schema.externalStorageServices.find('box') as ModelInstance<ExternalStorageServiceModel>;
        const boxAuthAccount = server.create('authorized-storage-account', {
            displayName: 'A box account',
            authorizedCapabilities: ['write'],
            externalStorageService: box,
            accountOwner: userRef,
            credentialsAvailable: true,
        });
        const s3 = server.schema.externalStorageServices.find('s3') as ModelInstance<ExternalStorageServiceModel>;
        const s3AuthAccount = server.create('authorized-storage-account', {
            displayName: 'An Amazon S3 account',
            authorizedCapabilities: ['write'],
            externalStorageService: s3,
            accountOwner: userRef,
            credentialsAvailable: false,
        });
        const otherS3AuthAccount = server.create('authorized-storage-account', {
            displayName: 'Another Amazon S3 account',
            authorizedCapabilities: ['write'],
            externalStorageService: s3,
            accountOwner: userRef,
            credentialsAvailable: false,
        });

        // create configured accounts
        server.create('configured-storage-addon', {
            displayName: 'My Box Account',
            rootFolder: 'boxroot',
            baseAccount: boxAuthAccount,
            externalStorageService: box,
            accountOwner: userRef,
            authorizedResource: nodeRef,
        });
        const s3AccountsDisplayNamesAndRootFolders = [{
            displayName: 'My Box Account',
            rootFolder: 's3root',
        }, {
            displayName: 'My AmazonS3 Account',
            rootFolder: 'others3root',
        }];
        server.create('configured-storage-addon', {
            displayName: s3AccountsDisplayNamesAndRootFolders[0].displayName,
            rootFolder: s3AccountsDisplayNamesAndRootFolders[0].rootFolder,
            baseAccount: s3AuthAccount,
            externalStorageService: s3,
            accountOwner: userRef,
            authorizedResource: nodeRef,
        });
        server.create('configured-storage-addon', {
            displayName: s3AccountsDisplayNamesAndRootFolders[1].displayName,
            rootFolder: s3AccountsDisplayNamesAndRootFolders[1].rootFolder,
            baseAccount: otherS3AuthAccount,
            externalStorageService: s3,
            accountOwner: userRef,
            authorizedResource: nodeRef,
        });

        const url = `/${node.id}/addons`;
        await visit(url);
        assert.equal(currentURL(), url, `We are on ${url}`);
        await percySnapshot('Acceptance | guid-node/addons | Editing configured addons | all addons tab');

        // check additonal storage providers
        assert.dom('[data-test-addon-card-configure]')
            .exists({ count: 2 }, '2 providers with configured addons are present');
        assert.dom('[data-test-addon-card="Amazon S3"]').containsText('Configure', 'Amazon S3 addon card is present');
        assert.dom('[data-test-addon-card="Box"]').containsText('Configure', 'Box addon card is present');

        // check connected accounts tab
        await click('[data-test-addons-tab-connected-accounts]');
        await percySnapshot('Acceptance | guid-node/addons | Editing configured addons | connected accounts tab');
        assert.dom('[data-test-addon-card]').exists({ count: 2 }, '2 providers with accounts are present');

        // Select S3 and edit associated accounts
        await click('[data-test-addon-card="Amazon S3"] [data-test-addon-card-configure]');
        // eslint-disable-next-line max-len
        await percySnapshot('Acceptance | guid-node/addons | Editing configured addons | list configured accounts for a provider');
        assert.dom('[data-test-addon-card]')
            .doesNotExist('Addon cards are not present after selecting a provider to edit');
        assert.dom('[data-test-addons-tab-all-addons]')
            .doesNotExist('All addons tab is not present after selecting a provider to edit');
        assert.dom('[data-test-addons-tab-connected-accounts]')
            .doesNotExist('Connected accounts tab is not present after selecting a provider to edit');
        assert.dom('[data-test-edit-connected-location]').exists({ count: 2 }, 'Two editable accounts are present');
        assert.dom('[data-test-remove-connected-location]').exists({ count: 2 }, 'Two remove buttons are present');
        const configuredAddonNames = document.querySelectorAll('[data-test-configured-addon-name]');
        const configuredAddonRootFolders = document.querySelectorAll('[data-test-configured-addon-root-folder]');
        s3AccountsDisplayNamesAndRootFolders.forEach(({ displayName, rootFolder }, i) => {
            assert.dom(configuredAddonNames[i]).containsText(displayName, `${displayName} is present`);
            assert.dom(configuredAddonRootFolders[i]).containsText(rootFolder, `${rootFolder} is present`);
        });

        // Edit first account
        await click('[data-test-edit-connected-location]:first-child');
        await percySnapshot('Acceptance | guid-node/addons | Editing configured addons | edit configured account');
        assert.dom('[data-test-edit-connected-location]')
            .doesNotExist('Edit buttons are not present after selecting an account to edit');
        assert.dom('[data-test-display-name-input]').exists('Name input is present');
        assert.dom('[data-test-display-name-input]')
            .hasValue(s3AccountsDisplayNamesAndRootFolders[0].displayName, 'Name input has correct value');
        assert.dom('[data-test-folder-path-option]').exists({ count: 1 }, 'Folder path shown');
        assert.dom('[data-test-root-folder-save]').isDisabled('Save button is disabled');
        assert.dom('[data-test-root-folder-cancel]').exists('Cancel button is present');
        // Edit first account display name
        await fillIn('[data-test-display-name-input]', 'New S3 Account Display Name');
        assert.dom('[data-test-root-folder-save]').isNotDisabled('Save button is enabled after displayName change');
        await fillIn('[data-test-display-name-input]', s3AccountsDisplayNamesAndRootFolders[0].displayName);
        assert.dom('[data-test-root-folder-save]').isDisabled('Save button is disabled after displayName reset');
        // Edit first account root folder
        await click('[data-test-folder-link]:first-child');
        assert.dom('[data-test-folder-path-option]').exists({ count: 2 }, '2 folders in path');
        await click('[data-test-root-folder-option]:first-child');
        assert.dom('[data-test-root-folder-save]')
            .isNotDisabled('Save button is enabled after selecting new root folder option');
        await fillIn('[data-test-display-name-input]', 'New S3 Account Display Name');
        // Save with root folder change and display name change
        await click('[data-test-root-folder-save]');

        // Check that changes were saved
        assert.dom('[data-test-addons-tab-all-addons]')
            .hasAttribute('aria-selected', 'true', 'Back to all addons tab after saving changes');
        await click('[data-test-addons-tab-connected-accounts]');
        await click('[data-test-addon-card="Amazon S3"] [data-test-addon-card-configure]');
        assert.dom('[data-test-edit-connected-location]').exists({ count: 2 }, 'Two editable accounts are still there');
        assert.dom('[data-test-remove-connected-location]').exists({ count: 2 }, 'Two remove buttons are present');
        const firstDisplayName = document.querySelectorAll('[data-test-configured-addon-name]')[0];
        const firstRootFolder = document.querySelectorAll('[data-test-configured-addon-root-folder]')[0];
        assert.dom(firstDisplayName)
            .containsText('New S3 Account Display Name', 'Display name change is saved');
        assert.dom(firstRootFolder).containsText('s3root-1-1', 'Root folder change is saved');

        // Remove other account
        await click('[data-test-remove-connected-location]:last-child');
        assert.dom('[data-test-confirm-remove-connected-location-button]').exists('Confirm remove button is present');
        assert.dom('[data-test-cancel-remove-connected-location-button]').exists('Cancel remove button is present');
        await click('[data-test-confirm-remove-connected-location-button]');
        assert.dom('[data-test-edit-connected-location]')
            .exists({ count: 1 }, 'One editable account is left after removing one');
        assert.dom('[data-test-remove-connected-location]')
            .exists({ count: 1 }, 'One remove button is present after removing one');
    });

    test('Adding new configured addons', async function(assert) {
        const store = this.owner.lookup('service:store');
        const mirageUser = server.create('user', 'loggedIn');
        const mirageNode = server.create('node', { id: 'add0n', currentUserPermissions: [Permission.Admin] });
        const user = await store.findRecord('user', mirageUser.id);
        const node = await store.findRecord('node', mirageNode.id);
        const userRef = server.create('user-reference', { userUri: user.links.self as string });
        const nodeRef = server.create('resource-reference', { resourceUri: node.links.iri as string });

        // create authorized account
        const box = server.schema.externalStorageServices.find('box') as ModelInstance<ExternalStorageServiceModel>;
        const boxAuthAccount = server.create('authorized-storage-account', {
            displayName: 'A box authorized account',
            authorizedCapabilities: ['write'],
            externalStorageService: box,
            accountOwner: userRef,
            credentialsAvailable: true,
        });
        const s3 = server.schema.externalStorageServices.find('s3') as ModelInstance<ExternalStorageServiceModel>;
        server.create('authorized-storage-account', {
            displayName: 'An Amazon S3 account',
            authorizedCapabilities: ['write'],
            externalStorageService: s3,
            accountOwner: userRef,
            credentialsAvailable: false,
        });

        // create configured account
        server.create('configured-storage-addon', {
            displayName: 'My Box Account',
            rootFolder: 'boxroot',
            baseAccount: boxAuthAccount,
            externalStorageService: box,
            accountOwner: userRef,
            authorizedResource: nodeRef,
        });

        const url = `/${node.id}/addons`;
        await visit(url);
        assert.equal(currentURL(), url, `We are on ${url}`);

        // Select S3 and add a new account
        await click('[data-test-addon-card="Amazon S3"] [data-test-addon-card-connect]');
        assert.dom('[data-test-addon-accept-terms-button]').exists('Terms shown first for new account');
        await percySnapshot('Acceptance | guid-node/addons | Adding new configured addons | terms page');
        await click('[data-test-addon-accept-terms-button]');
        // New account setup page
        assert.dom('[data-test-input="access_key"]').exists('Access key input is present');
        assert.dom('[data-test-input="secret_key"]').exists('Secret key input is present');
        assert.dom('[data-test-display-name-input]').exists('Display name input is present');
        await percySnapshot('Acceptance | guid-node/addons | Adding new configured addons | new account setup page');
        await fillIn('[data-test-input="access_key"]', 'access');
        await fillIn('[data-test-input="secret_key"]', 'secret');
        await fillIn('[data-test-display-name-input]', 'New S3 Account Display Name');
        await click('[data-test-addon-connect-account-button]');
        // Configure page
        assert.dom('[data-test-display-name-input]').exists('Name input is present');
        assert.dom('[data-test-root-folder-save]').isDisabled('Save button is disabled');
        await percySnapshot('Acceptance | guid-node/addons | Adding new configured addons | configure page');
        await fillIn('[data-test-display-name-input]', 'New S3 Account Display Name');
        await click('[data-test-root-folder-option]:first-child');
        await click('[data-test-root-folder-save]');

        // Verify new account is added
        await click('[data-test-addons-tab-connected-accounts]');
        assert.dom('[data-test-addon-card]').exists({ count: 2 }, '2 providers with configured accounts are present');

        // Add new Box account from configured accounts list page
        await click('[data-test-addon-card="Box"] [data-test-addon-card-configure]');
        await click('[data-test-add-another-location-button]');
        // Terms page
        assert.dom('[data-test-addon-accept-terms-button]').exists('Terms shown first for new account');
        await click('[data-test-addon-accept-terms-button]');
        // New or existing account page
        assert.dom('[data-test-addon-existing-account-button]')
            .exists('Existing account button is present for a provider with authorized account');
        assert.dom('[data-test-addon-new-account-button]').exists('New account button is present');
        await click('[data-test-addon-existing-account-button]');
        // Existing account page
        assert.dom('[data-test-existing-authorized-accounts-input]')
            .exists({ count: 1 }, 'Options for choosing existing authorized account present');
        assert.dom('[data-test-addon-authorize-button]')
            .doesNotExist('Authorize button is not present before choosing an account');
        await untrackedClick('[data-test-existing-authorized-accounts-input]');
        assert.dom('[data-test-addon-authorize-button]')
            .exists('Authorize button is present after choosing an account');
        await percySnapshot('Acceptance | guid-node/addons | Adding new configured addons | existing account page');
        await click('[data-test-addon-authorize-button]');
        // Confirm setup page
        assert.dom('[data-test-addon-confirm-setup-button]').exists('Confirm setup button is present');
        await percySnapshot('Acceptance | guid-node/addons | Adding new configured addons | confirm setup page');
        await click('[data-test-addon-confirm-setup-button]');
        // Configure page
        assert.dom('[data-test-display-name-input]').exists('Name input is present');
        assert.dom('[data-test-root-folder-save]').isDisabled('Save button is disabled');
        await fillIn('[data-test-display-name-input]', 'New Box Account Display Name');
        await click('[data-test-root-folder-option]:first-child');
        await click('[data-test-root-folder-save]');

        // check to see if new account is added
        await click('[data-test-addon-card="Box"] [data-test-addon-card-configure]');
        assert.dom('[data-test-edit-connected-location]').exists({ count: 2 }, 'Two editable accounts are present');
        assert.dom('[data-test-remove-connected-location]').exists({ count: 2 }, 'Two remove buttons are present');
    });
});
