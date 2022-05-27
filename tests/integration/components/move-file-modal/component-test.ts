import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';
import { TestContext } from 'ember-test-helpers';

import { Permission } from 'ember-osf-web/models/osf-model';
import OsfStorageFile from 'ember-osf-web/packages/files/osf-storage-file';
import OsfStorageProviderFile from 'ember-osf-web/packages/files/osf-storage-provider-file';
import { click } from 'ember-osf-web/tests/helpers';

interface MoveTestContext extends TestContext {
    manager: any;
    filesToMove: OsfStorageFile[];
    close: () => void;
    currentUser: any;
}

module('Integration | Component | move-file-modal', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: MoveTestContext) {
        this.store = this.owner.lookup('service:store');
        this.currentUser = this.owner.lookup('service:current-user');
    });

    test('move file from one node to another', async function(this: MoveTestContext, assert) {
        // Project with 1 child, and 2 grandchildren
        const project = server.create('node', {
            title: 'Horizontal bar', currentUserPermissions: [Permission.Read],
        }, 'withFiles', 'withStorage');
        const child = server.create('node', {
            title: 'Releases skills', parent: project, currentUserPermissions: [Permission.Read],
        }, 'withFiles', 'withStorage');
        const grandchildModel = server.create('node', {
            title: 'kovacs', parent: child,
        }, 'withFiles' , 'currentUserAdmin', 'withStorage');
        const otherGrandchild = server.create('node', {
            title: 'gienger', parent: child,
        }, 'withFiles', 'currentUserAdmin', 'withStorage');

        const gcOsfStorageModel = grandchildModel.files.models[0];
        const folderModel = server.create('file', {
            target: grandchildModel,
            parentFolder: gcOsfStorageModel.rootFolder,
        }, 'asFolder');
        const folder = await this.store.findRecord('file', folderModel.id);

        const grandchild = await this.store.findRecord('node', grandchildModel.id);
        const providers = await grandchild.queryHasMany('files');
        const gcOsfStorage = providers.findBy('id', gcOsfStorageModel.id);

        const fileModel = server.create('file', {
            name: 'Gaylord2',
            target: grandchildModel,
            parentFolder: gcOsfStorageModel.rootFolder,
        });
        const file = new OsfStorageFile(this.currentUser, await this.store.findRecord('file', fileModel.id));

        const parentFolder = new OsfStorageProviderFile(this.currentUser, gcOsfStorage!);
        const currentFolder = new OsfStorageFile(this.currentUser, folder);
        const manager = {
            targetNode: await this.store.findRecord('node', grandchild.id),
            currentFolder,
            folderLineage: [parentFolder, currentFolder],
            goToFolder: sinon.fake(),
        };
        this.manager = manager;
        this.close = sinon.fake();
        this.filesToMove = [file];

        await render(hbs`
        <MoveFileModal
            @isOpen={{true}}
            @close={{this.close}}
            @filesToMove={{this.filesToMove}}
            @manager={{this.manager}}
        />
        `);
        assert.dom('[data-test-move-modal-heading]').hasText(
            t('osf-components.move_file_modal.move_header', { itemCount: 1 }), 'correct modal header',
        );
        assert.dom('[data-test-move-files-button]').hasText(t('general.move'), 'move button text');
        assert.dom('[data-test-ancestor-button]').exists({count: 2}, 'two ancestors');
        assert.dom('[data-test-breadcrumb').exists({count: 2}, 'two breadcrumbs');
        assert.dom('[data-test-empty-node-or-child]').hasText(
            t('osf-components.move_file_modal.no_children'), 'No children',
        );
        assert.dom('[data-test-move-files-button]').isDisabled('Move files button is disabled');
        assert.dom('[data-test-moving-file-item]').doesNotExist('No moving file items');
        assert.dom('[data-test-move-done-button]').doesNotExist('done button does not exists');

        await percySnapshot('Integration | Component | move-file-modal | move start');
        await click('[data-test-ancestor-button="1"]'); // click parent node (releases)
        assert.dom('[data-test-ancestor-button]').exists({count: 1}, 'one ancestors');
        assert.dom('[data-test-breadcrumb').doesNotExist('no breadcrumbs');
        assert.dom('[data-test-move-to-node]').exists({count: 2}, 'two possible nodes to move to');
        assert.dom('[data-test-provider-icon]').exists({count: 1}, 'provider icon shown');
        assert.dom('[data-test-move-to-folder]').exists({count: 1}, 'one possible folder to move to');
        assert.dom('[data-test-move-files-button]').isDisabled('Move files button is disabled');
        assert.dom('[data-test-current-node-item-help-text]')
            .containsText(t('osf-components.move_file_modal.no_write_permission'), 'No write permission');
        assert.dom('[data-test-move-to-folder="osfstorage"]').isDisabled('osfstorage folder is disabled');

        await click(`[data-test-move-to-node="${otherGrandchild.id}"]`); // click node (gienger)
        assert.dom('[data-test-current-node-item-help-text]')
            .containsText(t('osf-components.move_file_modal.select_provider'), 'prompt to select provider');
        await click('[data-test-move-to-folder="osfstorage"]'); // click folder (osfstorage)
        assert.dom('[data-test-move-files-button]').isEnabled('Move files button is now enabled');

        await click('[data-test-move-files-button]'); // click move files button
        assert.dom('[data-test-moving-file-item]').exists({count: 1}, 'One moving file item');
        assert.dom('[data-test-moving-file-item]').hasText(
            t('osf-components.move_file_modal.success_move', { fileName: file.name }), 'Success message',
        );
        assert.dom('[data-test-move-files-button]').doesNotExist('move files button is no longer visible');
        assert.dom('[data-test-move-done-button]').exists('done button now exists');

        await percySnapshot('Integration | Component | move-file-modal | move finished');
    });

    test('copy file modal', async function(this: MoveTestContext, assert) {
        const projectModel = server.create('node', 'withFiles', 'withStorage');

        const osfStorageModel = projectModel.files.models[0];
        const folderModel = server.create('file', {
            target: projectModel,
            parentFolder: osfStorageModel.rootFolder,
        }, 'asFolder');
        const folder = await this.store.findRecord('file', folderModel.id);

        const project = await this.store.findRecord('node', projectModel.id);
        const providers = await project.queryHasMany('files');
        const osfStorage = providers.findBy('id', osfStorageModel.id);

        const fileModel = server.create('file', {
            target: projectModel,
            parentFolder: osfStorageModel.rootFolder,
        });
        const file = new OsfStorageFile(this.currentUser, await this.store.findRecord('file', fileModel.id));

        const parentFolder = new OsfStorageProviderFile(this.currentUser, osfStorage!);
        const currentFolder = new OsfStorageFile(this.currentUser, folder);
        const manager = {
            targetNode: await this.store.findRecord('node', project.id),
            currentFolder,
            folderLineage: [parentFolder, currentFolder],
            goToFolder: sinon.fake(),
        };
        this.manager = manager;
        this.close = sinon.fake();
        this.filesToMove = [file];

        await render(hbs`
        <MoveFileModal
            @isOpen={{true}}
            @close={{this.close}}
            @preserveOriginal={{true}}
            @filesToMove={{this.filesToMove}}
            @manager={{this.manager}}
        />
        `);
        assert.dom('[data-test-move-modal-heading]').hasText(
            t('osf-components.move_file_modal.copy_header', { itemCount: 1 }), 'correct modal header',
        );
        assert.dom('[data-test-move-files-button]').hasText(t('general.copy'), 'copy button text');

        await percySnapshot(assert);
    });
});
