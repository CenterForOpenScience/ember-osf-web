import { render, settled } from '@ember/test-helpers';
import ace from 'ember-ace';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | file editor', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async assert => {
        // Tests that the template renders without text

        await render(hbs`
            {{file-editor}}
        `);

        const editor = ace.edit(document.querySelector('[data-ember-ace]'));
        assert.equal(editor.getSession().getValue(), '');
    });

    test('it renders with text', async assert => {
        // Tests that the template renders when passed text

        await render(hbs`
            {{file-editor
                fileText='Test text'}}
        `);

        const editor = ace.edit(document.querySelector('[data-ember-ace]'));
        assert.equal(editor.getSession().getValue(), 'Test text');
    });

    test('revert button', async function(assert) {
        // Tests that the revert button properly reverts the text to its original value

        await render(hbs`
            {{file-editor
                fileText='Test text'}}
        `);

        const editor = ace.edit(document.querySelector('[data-ember-ace]'));
        assert.equal(editor.getSession().getValue(), 'Test text');

        editor.getSession().setValue('Just a test');
        assert.equal(editor.getSession().getValue(), 'Just a test');

        this.$('#btnRevertEditor').click();

        return settled()
            .then(() => {
                assert.equal(editor.getSession().getValue(), 'Test text');
            });
    });

    test('save new text', async function(assert) {
        // Tests that the save function works

        this.set('externalSaveAction', (actual: any) => {
            const expected = 'Test to save this new text!';
            assert.equal(actual, expected, 'Save function properly passes new value');
        });

        await render(hbs`
            {{file-editor
                save=(action externalSaveAction)}}
        `);

        const editor = ace.edit(document.querySelector('[data-ember-ace]'));
        editor.getSession().setValue('Test to save this new text!');

        this.$('#btnSaveEditor').click();
    });
});
