import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import ace from 'ember-ace';


moduleForComponent('file-editor', 'Integration | Component | file editor', {
    integration: true,
});

test('it renders', function(assert) {
    // Tests that the template renders without text

    this.render(hbs`
        {{file-editor}}
    `);

    const editor = ace.edit(document.querySelector('[data-ember-ace]'));
    assert.equal(editor.getSession().getValue(), '');
});

test('it renders with text', function(assert) {
    // Tests that the template renders when passed text

    this.render(hbs`
        {{file-editor 
            fileText='Test text'}}
    `);

    const editor = ace.edit(document.querySelector('[data-ember-ace]'));
    assert.equal(editor.getSession().getValue(), 'Test text');
});

test('revert button', function(assert) {
    // Tests that the revert button properly reverts the text to its original value

    this.render(hbs`
        {{file-editor 
            fileText='Test text'}}
    `);

    const editor = ace.edit(document.querySelector('[data-ember-ace]'));
    assert.equal(editor.getSession().getValue(), 'Test text');

    editor.getSession().setValue('Just a test');
    assert.equal(editor.getSession().getValue(), 'Just a test');

    this.$('#btnRevertEditor').click();

    return wait()
        .then(() => {
            assert.equal(editor.getSession().getValue(), 'Test text');
        });
});

test('save new text', function(assert) {
    // Tests that the save function works

    this.set('externalSaveAction', actual => {
        const expected = 'Test to save this new text!';
        assert.equal(actual, expected, 'Save function properly passes new value');
    });

    this.render(`
        {{file-editor
            save=(action externalSaveAction)}}
    `);

    const editor = ace.edit(document.querySelector('[data-ember-ace]'));
    editor.getSession().setValue('Test to save this new text!');

    this.$('#btnSaveEditor').click();
});
