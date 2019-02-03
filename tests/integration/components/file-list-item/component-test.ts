import EmberObject from '@ember/object';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | file-list-item', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        const itemName = 'file.txt';
        const guid = 'fak34';

        this.set('item', EmberObject.create({ itemName, guid }));

        await render(hbs`{{file-list-item item=item}}`);

        assert.ok((this.element.textContent as string).includes(itemName));
    });
});
