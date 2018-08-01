import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import 'qunit-dom';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | node-navbar/link', hooks => {
    setupRenderingTest(hooks);

    test('destination', async function(assert) {
        await render(hbs`{{node-navbar/link destination='registrations'}}`);
        assert.dom(this.element).hasText('Registrations');
    });

    test('block', async function(assert) {
        await render(hbs`
            {{#node-navbar/link}}
            template block text
            {{/node-navbar/link}}
        `);
        assert.dom(this.element).hasText('template block text');
    });
});
