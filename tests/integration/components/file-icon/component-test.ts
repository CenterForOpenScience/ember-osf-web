import EmberObject from '@ember/object';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | file-icon', hooks => {
    setupRenderingTest(hooks);

    test('default file icon', async function(assert) {
        this.set('item', EmberObject.create());
        await render(hbs`<FileIcon @item={{this.item}} />`);
        assert.dom('svg').hasClass('fa-file');
    });

    test('file type not found uses default', async function(assert) {
        const file = EmberObject.create({ name: 'file.notafiletype' });
        this.set('item', file);
        await render(hbs`<FileIcon @item={{this.item}} />`);
        assert.dom('svg').hasClass('fa-file');
    });

    test('file doesnt have a type, uses default', async function(assert) {
        const file = EmberObject.create({ name: 'doesntevenhaveatypelikewow' });
        this.set('item', file);
        await render(hbs`<FileIcon @item={{this.item}} />`);
        assert.dom('svg').hasClass('fa-file');
    });

    test('file gets the right icon for type - code', async function(assert) {
        const file = EmberObject.create({ name: 'normalfilefornormalpeople.c' });
        this.set('item', file);
        await render(hbs`<FileIcon @item={{this.item}} />`);
        assert.dom('svg').hasClass('fa-file-code');
        assert.dom('svg').doesNotHaveClass('fa-file');
    });

    test('file gets the right icon for type - image', async function(assert) {
        const file = EmberObject.create({ name: 'normalfilefornormalpeople.jpg' });
        this.set('item', file);
        await render(hbs`<FileIcon @item={{this.item}} />`);
        assert.dom('svg').hasClass('fa-file-image');
        assert.dom('svg').doesNotHaveClass('fa-file');
    });

    test('file gets the right icon for type - pdf', async function(assert) {
        const file = EmberObject.create({ name: 'normalfilefornormalpeople.pdf' });
        this.set('item', file);
        await render(hbs`<FileIcon @item={{this.item}} />`);
        assert.dom('svg').hasClass('fa-file-pdf');
        assert.dom('svg').doesNotHaveClass('fa-file');
    });

    test('file gets the right icon for type - word', async function(assert) {
        const file = EmberObject.create({ name: 'normalfilefornormalpeople.docx' });
        this.set('item', file);
        await render(hbs`<FileIcon @item={{this.item}} />`);
        assert.dom('svg').hasClass('fa-file-word');
        assert.dom('svg').doesNotHaveClass('fa-file');
    });

    test('file gets the right icon for type - video', async function(assert) {
        const file = EmberObject.create({ name: 'normalfilefornormalpeople.mp4' });
        this.set('item', file);
        await render(hbs`<FileIcon @item={{this.item}} />`);
        assert.dom('svg').hasClass('fa-file-video');
        assert.dom('svg').doesNotHaveClass('fa-file');
    });

    test('file gets the right icon for type - powerpoint', async function(assert) {
        const file = EmberObject.create({ name: 'normalfilefornormalpeople.ppt' });
        this.set('item', file);
        await render(hbs`<FileIcon @item={{this.item}} />`);
        assert.dom('svg').hasClass('fa-file-powerpoint');
        assert.dom('svg').doesNotHaveClass('fa-file');
    });

    test('file gets the right icon for type - audio', async function(assert) {
        const file = EmberObject.create({ name: 'normalfilefornormalpeople.mp3' });
        this.set('item', file);
        await render(hbs`<FileIcon @item={{this.item}} />`);
        assert.dom('svg').hasClass('fa-file-audio');
        assert.dom('svg').doesNotHaveClass('fa-file');
    });

    test('file gets the right icon for type - excel', async function(assert) {
        const file = EmberObject.create({ name: 'normalfilefornormalpeople.xlsx' });
        this.set('item', file);
        await render(hbs`<FileIcon @item={{this.item}} />`);
        assert.dom('svg').hasClass('fa-file-excel');
        assert.dom('svg').doesNotHaveClass('fa-file');
    });

    test('file gets the right icon for type - text', async function(assert) {
        const file = EmberObject.create({ name: 'normalfilefornormalpeople.txt' });
        this.set('item', file);
        await render(hbs`<FileIcon @item={{this.item}} />`);
        assert.dom('svg').hasClass('fa-file-alt');
        assert.dom('svg').doesNotHaveClass('fa-file');
    });

    test('file gets the right icon for type - provider', async function(assert) {
        const file = EmberObject.create({
            name: 'normalfilefornormalpeople',
            isProvider: true,
        });
        this.set('item', file);
        await render(hbs`<FileIcon @item={{this.item}} />`);
        assert.dom('svg').hasClass('fa-hdd');
        assert.dom('svg').doesNotHaveClass('fa-file');
    });

    test('file gets the right icon for type - folder', async function(assert) {
        const file = EmberObject.create({
            name: 'normalfilefornormalpeople',
            isFolder: true,
        });
        this.set('item', file);
        await render(hbs`<FileIcon @item={{this.item}} />`);
        assert.dom('svg').hasClass('fa-folder');
        assert.dom('svg').doesNotHaveClass('fa-file');
    });

    test('file gets the right icon for type - node', async function(assert) {
        const file = EmberObject.create({
            name: 'normalfilefornormalpeople',
            isNode: true,
        });
        this.set('item', file);
        await render(hbs`<FileIcon @item={{this.item}} />`);
        assert.dom('svg').hasClass('fa-cube');
        assert.dom('svg').doesNotHaveClass('fa-file');
    });
});
