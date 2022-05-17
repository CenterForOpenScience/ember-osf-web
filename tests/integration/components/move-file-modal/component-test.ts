import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';
import { TestContext } from 'ember-test-helpers';

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
        const project = server.create('node', { title: 'Horizontal bar' }, 'withFiles');
        const child = server.create('node', { title: 'Releases skills', parent: project }, 'withFiles');
        const grandchild = server.create('node', {
            title: 'kovacs', parent: child,
        }, 'withFiles' , 'currentUserAdmin');
        const otherGrandchild = server.create('node', {
            title: 'gienger', parent: child,
        }, 'withFiles', 'currentUserAdmin');
        const gcOsfStorage = grandchild.files.models[0];
        const folderModel = server.create('file', {
            target: grandchild,
            parentFolder: gcOsfStorage.rootFolder,
        }, 'asFolder');
        const folder = await this.store.findRecord('file', folderModel.id);

        const provider = await this.store.findRecord('file', gcOsfStorage.rootFolder.id);
        const parentFolder = new OsfStorageProviderFile(this.currentUser, provider);
        const currentFolder = new OsfStorageFile(this.currentUser, folder);
        const manager = {
            targetNode: await this.store.findRecord('node', grandchild.id),
            currentFolder,
            folderLineage: [parentFolder, currentFolder],
            goToFolder: sinon.fake(),
        };
        this.manager = manager;
        this.close = sinon.fake();

        const fileModel = server.create('file', {
            name: 'Gaylord2',
            target: grandchild,
            parentFolder: gcOsfStorage.rootFolder,
        });
        const file = new OsfStorageFile(this.currentUser, await this.store.findRecord('file', fileModel.id));

        this.filesToMove = [file];

        await render(hbs`
        <MoveFileModal
            @isOpen={{true}}
            @close={{this.close}}
            @filesToMove={{this.filesToMove}}
            @manager={{this.manager}}
        />
        `);
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
        assert.dom('[data-test-move-to-folder]').exists({count: 1}, 'one possible folder to move to');
        assert.dom('[data-test-move-files-button]').isDisabled('Move files button is disabled');

        await click(`[data-test-move-to-node="${otherGrandchild.id}"]`); // click node (gienger)

        await click('[data-test-move-to-folder="osfstorage"]'); // click folder (osfstorage)
        assert.dom('[data-test-move-files-button]').isEnabled('Move files button is now enabled');

        await click('[data-test-move-files-button]'); // click move files button
        assert.dom('[data-test-moving-file-item]').exists({count: 1}, 'One moving file item');
        assert.dom('[data-test-moving-file-item]').hasText(
            t('osf-components.move_file_modal.success', { fileName: file.name }), 'Success message',
        );
        assert.dom('[data-test-move-files-button]').doesNotExist('move files button is no longer visible');
        assert.dom('[data-test-move-done-button]').exists('done button now exists');

        await percySnapshot('Integration | Component | move-file-modal | move finished');
    });
});
