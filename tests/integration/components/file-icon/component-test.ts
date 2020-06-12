import EmberObject from '@ember/object';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | file-icon', hooks => {
    setupRenderingTest(hooks);

    test('default file icon', async function(assert) {
        this.set('item', EmberObject.create({}));
        await render(hbs`{{file-icon item=item}}`);
        assert.dom('i').hasClass('fa-file-o');
    });

    test('file type not found uses default', async function(assert) {
        const file = EmberObject.create({ itemName: 'file.notafiletype' });
        this.set('item', file);
        await render(hbs`{{file-icon item=item}}`);
        assert.dom('i').hasClass('fa-file-o');
    });

    test('file doesnt have a type, uses default', async function(assert) {
        const file = EmberObject.create({ itemName: 'doesntevenhaveatypelikewow' });
        this.set('item', file);
        await render(hbs`{{file-icon item=item}}`);
        assert.dom('i').hasClass('fa-file-o');
    });

    test('file gets the right icon for type', async function(assert) {
        const file = EmberObject.create({ itemName: 'normalfilefornormalpeople.c' });
        this.set('item', file);
        await render(hbs`{{file-icon item=item}}`);
        assert.dom('i').hasClass('fa-file-code-o');
        assert.dom('i').doesNotHaveClass('fa-file-o');
    });
});
