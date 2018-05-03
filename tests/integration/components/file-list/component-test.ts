import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | file-list', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
        await render(hbs`
            {{#file-list}}
                template block text
            {{/file-list}}
        `);

        assert.ok((this.element.textContent as string).trim());
    });
});
