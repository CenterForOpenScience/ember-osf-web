import EmberObject from '@ember/object';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | file-icon', hooks => {
    setupRenderingTest(hooks);

    test('default file icon', async function(assert) {
        this.set('item', EmberObject.create({}));
        await render(hbs`{{file-icon item=item}}`);
        assert.dom('svg').hasClass('fa-file');
    });

    test('file type not found uses default', async function(assert) {
        const file = EmberObject.create({ itemName: 'file.notafiletype' });
        this.set('item', file);
        await render(hbs`{{file-icon item=item}}`);
        assert.dom('svg').hasClass('fa-file');
    });

    test('file doesnt have a type, uses default', async function(assert) {
        const file = EmberObject.create({ itemName: 'doesntevenhaveatypelikewow' });
        this.set('item', file);
        await render(hbs`{{file-icon item=item}}`);
        assert.dom('svg').hasClass('fa-file');
    });

    test('file gets the right icon for code', async function(assert) {
        const file = EmberObject.create({ itemName: 'normalfilefornormalpeople.c' });
        this.set('item', file);
        await render(hbs`{{file-icon item=item}}`);
        assert.dom('svg').hasClass('fa-file-code');
        assert.dom('svg').doesNotHaveClass('fa-file');
    });

    test('file gets the right icon for image', async function(assert) {
        const file = EmberObject.create({ itemName: 'image.png' });
        this.set('item', file);
        await render(hbs`{{file-icon item=item}}`);
        assert.dom('svg').hasClass('fa-file-image');
    });

    test('file gets the right icon for pdf', async function(assert) {
        const file = EmberObject.create({ itemName: 'portable.pdf' });
        this.set('item', file);
        await render(hbs`{{file-icon item=item}}`);
        assert.dom('svg').hasClass('fa-file-pdf');
    });

    test('file gets the right icon for word docs', async function(assert) {
        const file = EmberObject.create({ itemName: 'word.docx' });
        this.set('item', file);
        await render(hbs`{{file-icon item=item}}`);
        assert.dom('svg').hasClass('fa-file-word');
    });

    test('file gets the right icon for videos', async function(assert) {
        const file = EmberObject.create({ itemName: 'video.avi' });
        this.set('item', file);
        await render(hbs`{{file-icon item=item}}`);
        assert.dom('svg').hasClass('fa-file-video');
    });

    test('file gets the right icon for ppt', async function(assert) {
        const file = EmberObject.create({ itemName: 'preso.pptx' });
        this.set('item', file);
        await render(hbs`{{file-icon item=item}}`);
        assert.dom('svg').hasClass('fa-file-powerpoint');
    });

    test('file gets the right icon for audio', async function(assert) {
        const file = EmberObject.create({ itemName: 'music.mp3' });
        this.set('item', file);
        await render(hbs`{{file-icon item=item}}`);
        assert.dom('svg').hasClass('fa-file-audio');
    });

    test('file gets the right icon for spreadsheets', async function(assert) {
        const file = EmberObject.create({ itemName: 'sheet.xlsx' });
        this.set('item', file);
        await render(hbs`{{file-icon item=item}}`);
        assert.dom('svg').hasClass('fa-file-excel');
    });

    test('file gets the right icon for text', async function(assert) {
        const file = EmberObject.create({ itemName: 'untitled.txt' });
        this.set('item', file);
        await render(hbs`{{file-icon item=item}}`);
        assert.dom('svg').hasClass('fa-file-alt');
    });
});
