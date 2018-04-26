import Service from '@ember/service';
import { findAll, render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | node-navbar', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        await render(hbs`{{node-navbar renderInPlace=true}}`);

        assert.ok((this.element.textContent as string).trim());
    });

    test('it renders active tab when in proper route', async function(assert) {
        const routerStub = Service.extend({
            currentRouteName: 'guid-node.wiki',
        });

        this.owner.register('service:router', routerStub);
        await render(hbs`{{node-navbar renderInPlace=true}}`);

        assert.ok(findAll('li.active').length);
        assert.ok(findAll('li.active')[0].innerHTML.includes('wiki'));
    });

    test('it renders no active tabs', async function(assert) {
        const routerStub = Service.extend({
            currentRouteName: 'guid-node.forks',
        });

        this.owner.register('service:router', routerStub);
        await render(hbs`{{node-navbar renderInPlace=true}}`);

        assert.ok(!findAll('li.active').length);
    });
});
