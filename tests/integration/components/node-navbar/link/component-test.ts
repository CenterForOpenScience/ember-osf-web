import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | node-navbar/link', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.set('node', {
            modelName: 'node',
        });
    });

    test('destination', async function(assert) {
        await render(hbs`{{node-navbar/link node=this.node destination='registrations'}}`);
        assert.dom(this.element).hasText('Registrations');
    });

    test('block', async function(assert) {
        await render(hbs`
            {{#node-navbar/link node=this.node}}
                template block text
            {{/node-navbar/link}}
        `);
        assert.dom(this.element).hasText('template block text');
    });
});
