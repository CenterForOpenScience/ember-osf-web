import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | node-navbar/link', hooks => {
    setupRenderingTest(hooks);
    test('it renders', async function(assert) {
        await render(hbs`{{node-navbar/link}}`);

        assert.ok(this.element.textContent.trim(), '');

        await render(hbs`
            {{#node-navbar/link}}
            template block text
            {{/node-navbar/link}}
            `);
        assert.ok(this.element.textContent.trim().includes('template block text'));
    });
});
