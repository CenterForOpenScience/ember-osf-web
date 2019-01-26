import { render } from '@ember/test-helpers';
import ace from 'ember-ace';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import { click } from 'ember-osf-web/tests/helpers';

module('Integration | Component | file-editor', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async assert => {
        await render(hbs`{{file-editor}}`);

        const editor = ace.edit(document.querySelector('[data-ember-ace]'));
        assert.equal(editor.getSession().getValue(), '');
    });

    test('it renders with text', async assert => {
        await render(hbs`{{file-editor fileText='Test text'}}`);

        const editor = ace.edit(document.querySelector('[data-ember-ace]'));
        assert.equal(editor.getSession().getValue(), 'Test text');
    });

    test('revert button reverts the text to its original value', async assert => {
        await render(hbs`{{file-editor fileText='Test text'}}`);

        const editor = ace.edit(document.querySelector('[data-ember-ace]'));
        assert.equal(editor.getSession().getValue(), 'Test text');

        editor.getSession().setValue('Just a test');
        assert.equal(editor.getSession().getValue(), 'Just a test');

        await click('[data-test-button-revert]');
        assert.equal(editor.getSession().getValue(), 'Test text');
    });

    test('save button calls save action', async function(assert) {
        this.set('externalSaveAction', (actual: any) => {
            const expected = 'Test to save this new text!';
            assert.equal(actual, expected, 'Save function properly passes new value');
        });

        await render(hbs`{{file-editor save=(action externalSaveAction)}}`);

        const editor = ace.edit(document.querySelector('[data-ember-ace]'));
        editor.getSession().setValue('Test to save this new text!');

        assert.expect(1);
        await click('[data-test-button-save]');
    });
});
