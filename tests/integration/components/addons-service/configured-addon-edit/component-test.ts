import { click, fillIn, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';
import sinon, { SinonSpy } from 'sinon';

import ExternalStorageServiceModel from 'ember-osf-web/models/external-storage-service';
import ConfiguredStorageAddonModel from 'ember-osf-web/models/configured-storage-addon';

interface ThisTestContext extends TestContext {
    configuredAddon: ConfiguredStorageAddonModel;
    onSave: SinonSpy;
    onCancel: SinonSpy;
}

module('Integration | Component | addons-service | configured-addon-edit', function(this: ThisTestContext, hooks) {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    test('it loads and saves', async function(this: ThisTestContext, assert) {
        const store = this.owner.lookup('service:store');
        server.loadFixtures('external-storage-services');
        const boxAddon = server.schema.externalStorageServices
            .find('box') as ModelInstance<ExternalStorageServiceModel>;
        const userRef = server.create('user-reference');
        const resourceRef = server.create('resource-reference');
        const boxAccount = server.create('authorized-storage-account', {
            displayName: 'My Box Account',
            externalStorageService: boxAddon,
            accountOwner: userRef,
            credentialsAvailable: true,
        });

        const mirageConfiguredAddon = server.create('configured-storage-addon', {
            displayName: 'My configured addon',
            rootFolder: undefined,
            externalStorageService: boxAddon,
            accountOwner: userRef,
            authorizedResource:  resourceRef,
            baseAccount: boxAccount,
        });
        const configuredAddon = await store.findRecord('configured-storage-addon', mirageConfiguredAddon.id);
        this.configuredAddon = configuredAddon;
        this.onSave = sinon.fake();
        this.onCancel = sinon.fake();
        await render(hbs`
<AddonsService::ConfiguredAddonEdit
    @configuredAddon={{this.configuredAddon}}
    @onSave={{this.onSave}}
    @onCancel={{this.onCancel}}
/>
        `);

        // Initial state when no folder is selected
        assert.dom('[data-test-display-name-input]').hasValue('My configured addon', 'Display name is poopulated');
        assert.dom('[data-test-go-to-root]').exists('Go to root button exists');
        assert.dom('[data-test-folder-path-option]').doesNotExist('No folder option when at root');
        assert.dom('[data-test-folder-link]').exists({ count: 5 }, 'Root folder has 5 folders');
        assert.dom('[data-test-root-folder-option]').exists({ count: 5 }, 'Checkbox available for each folder option');
        assert.dom('[data-test-root-folder-save]').isDisabled('Save button is disabled when no folder is selected');

        // updating and reseting the display name
        assert.dom('[data-test-display-name-error]').doesNotExist('No error message initially');
        await fillIn('[data-test-display-name-input]', '');
        assert.dom('[data-test-root-folder-save]').isDisabled('Save button is disabled when display name is empty');
        assert.dom('[data-test-display-name-error]').exists('Error message is shown when display name is empty');
        await fillIn('[data-test-display-name-input]', 'My configured addon');
        assert.dom('[data-test-display-name-error]').doesNotExist('No error message after display name is set');

        // Navigate into a folder
        const folderLinks = this.element.querySelectorAll('[data-test-folder-link]');
        await click(folderLinks[0]);
        assert.dom('[data-test-folder-path-option]').exists({ count: 1 }, 'Has root option and first folderoption');

        // Navigate back to root
        const navButtons = this.element.querySelectorAll('[data-test-folder-path-option]');
        await click(navButtons[0]);
        assert.dom('[data-test-folder-path-option]').exists({ count: 1 }, 'Just root folder path option');

        // Select a root folder
        const folderOptions = this.element.querySelectorAll('[data-test-root-folder-option]');
        await click(folderOptions[0]);
        assert.dom('[data-test-root-folder-save]').isEnabled('Save button is enabled');

        // Save
        await click('[data-test-root-folder-save]');
        const args = {
            rootFolder: 'root-1-1',
            displayName: 'My configured addon',
        };

        assert.ok(this.onSave.calledOnceWith(args), 'Save action was called with selected folder id');
    });
});
