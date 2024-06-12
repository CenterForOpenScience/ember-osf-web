import { currentRouteName } from '@ember/test-helpers';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { t } from 'ember-intl/test-support';
import { TestContext } from 'ember-test-helpers';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest, visit } from 'ember-osf-web/tests/helpers';
import NodeModel from 'ember-osf-web/models/node';
import FileModel from 'ember-osf-web/models/file';
import FileProviderModel from 'ember-osf-web/models/file-provider';
import { Permission } from 'ember-osf-web/models/osf-model';
import ExternalStorageServiceModel from 'ember-osf-web/models/external-storage-service';

interface GuidNodeTestContext extends TestContext {
    node: ModelInstance<NodeModel>;
    osfStorage: ModelInstance<FileProviderModel>;
    file: ModelInstance<FileModel>;
}

module('Acceptance | guid-node/files', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(async function(this: GuidNodeTestContext) {
        this.node = server.create('node', 'withFiles','withStorage');
        this.osfStorage = this.node.files.models.firstObject!;
        this.file = server.create('file', {
            id: 'hello',
            target: this.node,
            parentFolder: this.osfStorage.rootFolder,
        });
    });

    test('left-nav: logged out', async function(this: GuidNodeTestContext, assert) {
        await visit(`/${this.node.id}/files`);
        assert.equal(currentRouteName(), 'guid-node.files.provider', 'logged out: Current route is files');
        assert.dom('[data-test-overview-link]').exists('logged out: Overview link exists');
        assert.dom('[data-test-files-link]').exists('logged out: Files link exists');
        assert.dom('[data-test-analytics-link]').exists('logged out: Analytics link exists');
        assert.dom('[data-test-registrations-link]').exists('logged out: Registrations link exists');
        assert.dom('[data-test-contributors-link]').doesNotExist('logged out: Contributors link does not exist');
        assert.dom('[data-test-settings-link]').doesNotExist('logged out: Settings link does not exist');
    });

    test('left-nav: VOL', async function(this: GuidNodeTestContext, assert) {
        const currentUser = this.owner.lookup('service:current-user');
        currentUser.viewOnlyToken = 'SomeVolToken';
        await visit(`/${this.node.id}/files`);
        assert.equal(currentRouteName(), 'guid-node.files.provider', 'VOL: Current route is files');
        assert.dom('[data-test-overview-link]').exists('VOL: Overview link exists');
        assert.dom('[data-test-files-link]').exists('VOL: Files link exists');
        assert.dom('[data-test-analytics-link]').exists('VOL: Analytics link exists');
        assert.dom('[data-test-registrations-link]').exists('VOL: Registrations link exists');
        assert.dom('[data-test-contributors-link]').doesNotExist('VOL: Contributors link does not exist');
        assert.dom('[data-test-settings-link]').doesNotExist('VOL: Settings link does not exist');
    });

    test('left-nav: AVOL', async function(this: GuidNodeTestContext, assert) {
        const node = await this.owner.lookup('service:store').findRecord('node', this.node.id);
        node.apiMeta = { version: '2', anonymous: true };
        await visit(`/${this.node.id}/files`);
        assert.equal(currentRouteName(), 'guid-node.files.provider', 'AVOL: Current route is files');
        assert.dom('[data-test-overview-link]').exists('AVOL: Overview link exists');
        assert.dom('[data-test-files-link]').exists('AVOL: Files link exists');
        assert.dom('[data-test-analytics-link]').exists('AVOL: Analytics link exists');
        assert.dom('[data-test-registrations-link]').doesNotExist('AVOL: Registrations link does not exist');
        assert.dom('[data-test-contributors-link]').doesNotExist('AVOL: Contributors link does not exist');
        assert.dom('[data-test-settings-link]').doesNotExist('AVOL: Settings link does not exist');
    });

    test('read user', async function(this: GuidNodeTestContext, assert) {
        this.node.currentUserPermissions = [Permission.Read];
        await visit(`/${this.node.id}/files`);

        assert.equal(currentRouteName(), 'guid-node.files.provider', 'Current route is files');

        // Check leftnav
        assert.dom('[data-test-overview-link]').exists('Overview link exists');
        assert.dom('[data-test-files-link]').exists('Files link exists');
        assert.dom('[data-test-file-providers-list]')
            .containsText(t('registries.overview.files.storage_providers.osfstorage'), 'Osf Storage shown as provider');
        assert.dom('[data-test-analytics-link]').exists('Analytics link exists');
        assert.dom('[data-test-registrations-link]').exists('Registrations link exists');
        assert.dom('[data-test-contributors-link]').exists('Contributors link exists');
        assert.dom('[data-test-settings-link]').exists('Settings link exists');

        // Check file actions
        await click(`[data-test-file-list-item="${this.file.id}"] [data-test-file-download-share-trigger]`);
        await percySnapshot(assert);
        assert.dom('[data-test-copy-button]').exists('Single file copy available');
        assert.dom('[data-test-move-button]').doesNotExist('Single file move not available');
        assert.dom('[data-test-delete-button]').doesNotExist('Single file delete not available');
        assert.dom('[data-test-rename-link]').doesNotExist('Single file rename not available');
        await click(`[data-test-file-list-item="${this.file.id}"] [data-test-file-download-share-trigger]`);

        // Check bulk file actions
        await click(`[data-test-select-file="${this.file.id}"]`);
        assert.dom('[data-test-bulk-copy-trigger]').exists('Bulk copy available');
        assert.dom('[data-test-bulk-move-trigger]').doesNotExist('Bulk move not available');
        assert.dom('[data-test-bulk-delete-trigger]').doesNotExist('Bulk delete not available');

        await click('[data-test-bulk-copy-trigger]');
        assert.dom('[data-test-dialog]').containsText(t('osf-components.move_file_modal.no_write_permission'),
            'Copy modal has permission-related message');
        assert.dom('[data-test-move-files-button]').isDisabled('Copy button disabled');
        assert.dom('[data-test-move-files-button]').containsText(t('general.copy'));
    });

    test('No files', async function(this: GuidNodeTestContext, assert) {
        this.osfStorage!.rootFolder.update({files: []});

        await visit(`/${this.node.id}/files`);
        await percySnapshot(assert);
        assert.dom('[data-test-file-list-item]').doesNotExist('No file or folder items');
        assert.dom('[data-test-empty-folder]')
            .containsText(t('osf-components.file-browser.empty_folder'), 'Empty folder');
    });

    test('Multi-file actions', async function(this: GuidNodeTestContext, assert) {
        this.node.update({ currentUserPermissions: ['admin', 'write', 'read'] });
        await visit(`/${this.node.id}/files`);
        await click(`[data-test-select-file="${this.file.id}"]`);
        await percySnapshot(assert);
        assert.dom('[data-test-bulk-move-trigger]').exists('Bulk move available');
        assert.dom('[data-test-bulk-copy-trigger]').exists('Bulk copy available');
        assert.dom('[data-test-bulk-delete-trigger]').exists('Bulk delete available');

        await click('[data-test-bulk-move-trigger]');
        assert.dom('[data-test-dialog]').doesNotContainText(t('osf-components.move_file_modal.no_write_permission'),
            'Move modal does not show permission-related message');
    });

    test('Switching providers', async function(this: GuidNodeTestContext, assert) {
        const bitbucketAddon = server.schema.externalStorageServices
            .find('bitbucket') as ModelInstance<ExternalStorageServiceModel>;
        const addonFile = server.create('resource-reference', { id: this.node.id });
        server.create('configured-storage-addon', {
            id: 'bitbucket',
            displayName: 'Bitbucket',
            rootFolder: '/woot/',
            externalStorageService: bitbucketAddon,
            authorizedResource: addonFile,
        });
        await visit(`/${this.node.id}/files`);
        assert.dom('[data-test-files-provider-link="bitbucket"]').exists('Bitbucket shown');
        assert.dom('[data-test-files-provider-link="bitbucket"]').hasAttribute('href',
            `/${this.node.id}/files/bitbucket`, 'Links to bitbucket files');
    });
});
