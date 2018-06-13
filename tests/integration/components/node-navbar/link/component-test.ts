import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { module, test } from 'qunit';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | node-navbar/link', hooks => {
    setupRenderingTest(hooks);

    test('destination', async function(assert) {
        await render(hbs`{{node-navbar/link destination='registrations'}}`);
        assert.hasText(this.element, 'Registrations');
    });

    test('block', async function(assert) {
        await render(hbs`
            {{#node-navbar/link}}
            template block text
            {{/node-navbar/link}}
        `);
        assert.hasText(this.element, 'template block text');
    });
});
