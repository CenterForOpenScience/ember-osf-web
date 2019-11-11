import { click, render } from '@ember/test-helpers';
import { animationsSettled } from 'ember-animated/test-support';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import { Permission } from 'ember-osf-web/models/osf-model';
import CurrentUser from 'ember-osf-web/services/current-user';

interface ThisTestContext extends TestContext {
    currentUser: CurrentUser;
}

type Field = 'name' | 'date-modified';

function getItemAttr(field: Field) {
    const selector = `[data-test-file-${field}]`;
    const elements = [...document.querySelectorAll(selector)];

    return elements.map((elt: Element) => elt.innerHTML.trim());
}

module('Integration | Component | files-widget', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: ThisTestContext) {
        this.store = this.owner.lookup('service:store');
        this.currentUser = this.owner.lookup('service:current-user');
    });

    test('it renders, list node files', async function(this: ThisTestContext, assert) {
        const mirageNode = server.create('node',
            { currentUserPermissions: Object.values(Permission) },
            'withFiles');

        const [osfstorage] = mirageNode.files.models;
        const count = osfstorage.rootFolder.files.models.length;

        const node = await this.store.findRecord('node', mirageNode.id);
        this.set('node', node);
        await render(hbs`<Files::Widget @node={{this.node}} />`);

        assert.dom('[data-test-file-browser-list]').isVisible();
        assert.dom('[data-test-file-row]').exists({ count });
    });

    test('navigate between folders', async function(this: ThisTestContext, assert) {
        const mirageNode = server.create('node',
            { currentUserPermissions: Object.values(Permission) }, 'withFiles');
        const folder = server.create('file', { target: mirageNode }, 'asFolder');
        const [osfstorage] = mirageNode.files.models;
        const folderItems = server.createList('file', 6, { target: mirageNode, parentFolder: folder });

        osfstorage.rootFolder.update({ files: [folder] });
        osfstorage.save();

        const node = await this.store.findRecord('node', mirageNode.id);
        this.set('node', node);

        await render(hbs`<Files::Widget @node={{this.node}} />`);

        assert.dom('[data-test-file-browser-list]').isVisible();
        assert.dom('[data-test-file-row]').exists({ count: osfstorage.rootFolder.files.models.length });

        // Navigate to child folder.
        await click(`[data-test-file-browser-item="${folder.id}"]`);
        await animationsSettled();

        assert.dom('[data-test-file-row]').exists({ count: folderItems.length });
        assert.dom('[data-test-current-folder]').isVisible();
        assert.dom('[data-test-current-folder] .fa-angle-left').isVisible();

        let actualfolderItems = getItemAttr('name');
        assert.deepEqual(actualfolderItems.sort(), folderItems.mapBy('name').sort());

        // Navigate back to root folder.
        await click(`[data-test-file-browser-item="${folder.id}"]`);
        await animationsSettled();

        actualfolderItems = getItemAttr('name');
        assert.dom('[data-test-current-folder]').isNotVisible();
        assert.dom('[data-test-file-row]').exists({ count: osfstorage.rootFolder.files.models.length });
        assert.deepEqual(actualfolderItems.sort(), osfstorage.rootFolder.files.models.mapBy('name').sort());
    });

    test('no files, shows upload placeholder ', async function(this: ThisTestContext, assert) {
        const mirageNode = server.create('node', { currentUserPermissions: Object.values(Permission) });

        server.create('file-provider', { node: mirageNode });
        const node = await this.store.findRecord('node', mirageNode.id);

        this.set('node', node);
        await render(hbs`<Files::Widget @node={{this.node}} />`);

        assert.dom('[data-test-no-files-placeholder]').isVisible('Shows drag and drop files to upload in folder');
    });

    test('load more files', async function(this: ThisTestContext, assert) {
        const mirageNode = server.create('node', { currentUserPermissions: Object.values(Permission) });

        const totalCount = 15;
        const pageSize = 10;
        const files = server.createList('file', totalCount, { target: mirageNode });
        const osfstorage = server.create('file-provider', { node: mirageNode });

        osfstorage.rootFolder.update({ files });

        const node = await this.store.findRecord('node', mirageNode.id);
        this.set('node', node);

        await render(hbs`<Files::Widget @node={{this.node}} />`);

        assert.dom('[data-test-file-browser-list]').isVisible();
        assert.dom('[data-test-file-row]').exists({ count: pageSize });
        assert.dom('[data-test-load-more-items]').exists();

        await click('[data-test-load-more-items]');

        assert.dom('[data-test-file-row]').exists({ count: totalCount });
    });
});
