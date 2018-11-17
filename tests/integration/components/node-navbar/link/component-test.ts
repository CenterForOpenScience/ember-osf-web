import Service from '@ember/service';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import hbs from 'htmlbars-inline-precompile';

import { FakeNode } from '../component-test';

module('Integration | Component | node-navbar/link', hooks => {
    setupRenderingTest(hooks);

    test('destination', async function(assert) {
        const routerStub = Service.extend({
            isActive: () => false,
        });
        this.owner.register('service:router', routerStub);

        this.set('node', new FakeNode());
        await render(hbs`{{node-navbar/link node=this.node destination='registrations'}}`);
        assert.dom(this.element).hasText('Registrations');
    });

    test('block', async function(assert) {
        const routerStub = Service.extend({
            isActive: () => false,
        });
        this.owner.register('service:router', routerStub);

        this.set('node', new FakeNode());
        await render(hbs`
            {{#node-navbar/link node=this.node}}
                template block text
            {{/node-navbar/link}}
        `);
        assert.dom(this.element).hasText('template block text');
    });
});
