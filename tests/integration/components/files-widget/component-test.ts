import { click, render } from '@ember/test-helpers';
import { animationsSettled } from 'ember-animated/test-support';
import { hbs } from 'ember-cli-htmlbars';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import moment from 'moment';
import { module, test } from 'qunit';

import File from 'ember-osf-web/models/file';
import { Permission } from 'ember-osf-web/models/osf-model';
import CurrentUser from 'ember-osf-web/services/current-user';

interface ThisTestContext extends TestContext {
    currentUser: CurrentUser;
}

type Field = 'name' | 'date-modified';
type Order = 'ascending' | 'descending';

function getItemAttr(field: Field) {
    const selector = `[data-test-file-${field}]`;
    const elements = [...document.querySelectorAll(selector)];

    return elements.map((elt: Element) => elt.innerHTML.trim());
}

function assertOrdered(assert: Assert, field: Field, order: Order, expected: string[]) {
    const actual = getItemAttr(field);
    assert.deepEqual(actual, expected, `can sort items ${name} in ${order} order`);
}

function convertDate(item: ModelInstance<File>): string {
    return moment(item.dateModified).format('YYYY-MM-DD hh:mm A');
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
        await render(hbs`<Files::Widget @node={{this.node}} @canEdit={{true}} />`);

        assert.dom('[data-test-file-browser-list]').isVisible();
        assert.dom('[data-test-file-row]').exists({ count });
    });

    test('it renders non-editable view for revision', async function(this: ThisTestContext, assert) {
        const mirageRegistration = server.create('registration', 'withFiles');
        const registration = await this.store.findRecord('registration', mirageRegistration.id);
        this.set('registration', registration);
        const [osfstorage] = mirageRegistration.files.models;
        const count = osfstorage.rootFolder.files.models.length;
        await render(hbs`<Files::Widget @node={{this.registration}} @canEdit={{false}} />`);
        assert.dom('[data-test-delete-current-folder]').doesNotExist();
        assert.dom('[data-test-delete-file]').doesNotExist();
        assert.dom('[data-test-files-menu-trigger]').doesNotExist();
        assert.dom('[data-test-file-browser-list]').isVisible();
        assert.dom('[data-test-file-row]').exists({ count});
    });

    test('can sort files by name and date', async function(this: ThisTestContext, assert) {
        const mirageNode = server.create('node', { currentUserPermissions: Object.values(Permission) });

        const osfstorage = server.create('file-provider', { target: mirageNode });
        const folderOne = server.create('file',
            { target: mirageNode, name: 'c' }, 'asFolder');
        const fileOne = server.create('file',
            { target: mirageNode, name: 'a', dateModified: new Date(2019, 3, 3) });
        const fileTwo = server.create('file',
            { target: mirageNode, name: 'b', dateModified: new Date(2019, 2, 2) });

        osfstorage.rootFolder.update({
            files: [fileOne, fileTwo, folderOne],
        });

        const node = await this.store.findRecord('node', mirageNode.id);
        this.set('node', node);
        await render(hbs`<Files::Widget @node={{this.node}} @canEdit={{true}} />`);

        let expected;

        assert.dom('[data-test-ascending-sort="name"]').isVisible();
        await click('[data-test-ascending-sort="name"]');
        expected = [fileOne.name, fileTwo.name, folderOne.name];
        assertOrdered(assert, 'name', 'ascending', expected);

        assert.dom('[data-test-descending-sort="name"]').isVisible();
        await click('[data-test-descending-sort="name"]');
        expected = [folderOne.name, fileTwo.name, fileOne.name];
        assertOrdered(assert, 'name', 'descending', expected);

        assert.dom('[data-test-ascending-sort="date_modified"]').isVisible();
        await click('[data-test-ascending-sort="date_modified"]');
        expected = [fileTwo, fileOne].map(convertDate);
        assertOrdered(assert, 'date-modified', 'ascending', expected);

        assert.dom('[data-test-descending-sort="date_modified"]').isVisible();
        await click('[data-test-descending-sort="date_modified"]');
        expected = [fileOne, fileTwo].map(convertDate);
        assertOrdered(assert, 'date-modified', 'descending', expected);
    });

    test('navigate between folders', async function(this: ThisTestContext, assert) {
        const mirageNode = server.create('node', { currentUserPermissions: Object.values(Permission) });

        const folder = server.create('file', { target: mirageNode }, 'asFolder');
        const osfstorage = server.create('file-provider', { target: mirageNode });
        const folderItems = server.createList('file', 6, { target: mirageNode, parentFolder: folder });

        osfstorage.rootFolder.update({ files: [folder] });

        const node = await this.store.findRecord('node', mirageNode.id);
        this.set('node', node);

        await render(hbs`<Files::Widget @node={{this.node}} @canEdit={{true}} />`);

        assert.dom('[data-test-current-folder]').isNotVisible();
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

        const osfstorage = server.create('file-provider', { target: mirageNode });

        osfstorage.rootFolder.update({ files: [] });
        const node = await this.store.findRecord('node', mirageNode.id);

        this.set('node', node);
        await render(hbs`<Files::Widget @node={{this.node}} @canEdit={{true}} />`);

        assert.dom('[data-test-no-files-placeholder]').isVisible('Shows drag and drop files to upload in folder');
    });

    test('load more files', async function(this: ThisTestContext, assert) {
        const mirageNode = server.create('node', { currentUserPermissions: Object.values(Permission) });

        const totalCount = 15;
        const pageSize = 10;
        const files = server.createList('file', totalCount, { target: mirageNode });
        const osfstorage = server.create('file-provider', { target: mirageNode });

        osfstorage.rootFolder.update({ files });

        const node = await this.store.findRecord('node', mirageNode.id);
        this.set('node', node);

        await render(hbs`<Files::Widget @node={{this.node}} @canEdit={{true}} />`);

        assert.dom('[data-test-file-browser-list]').isVisible();
        assert.dom('[data-test-file-row]').exists({ count: pageSize });
        assert.dom('[data-test-load-more-items]').exists();

        await click('[data-test-load-more-items]');

        assert.dom('[data-test-file-row]').exists({ count: totalCount });
    });
});
