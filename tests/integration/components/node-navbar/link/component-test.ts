import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { module, test } from 'qunit';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | node-navbar/link', hooks => {
    setupRenderingTest(hooks);
    test('it renders', async function(assert) {
        await render(hbs`{{node-navbar/link}}`);

        assert.ok((this.element.textContent as string).trim(), '');

        await render(hbs`
            {{#node-navbar/link}}
            template block text
            {{/node-navbar/link}}
        `);
        assert.ok((this.element.textContent as string).trim().includes('template block text'));
    });
});
