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
            currentRouteName: 'guid-node.files',
        });

        this.owner.register('service:router', routerStub);
        await render(hbs`{{node-navbar renderInPlace=true}}`);

        assert.ok(findAll('li.active').length);
        assert.ok(findAll('li.active')[0].innerHTML.includes('files'));
    });

    test('it renders no active tabs', async function(assert) {
        const routerStub = Service.extend({
            currentRouteName: 'guid-node.forks',
        });

        this.owner.register('service:router', routerStub);
        await render(hbs`{{node-navbar renderInPlace=true}}`);

        assert.ok(!findAll('li.active').length);
    });

    test('it includes the wiki link when the wiki is enabled', async function(assert) {
        this.set('node', { wikiEnabled: true });

        await render(hbs`<NodeNavbar @renderInPlace={{true}} @node={{this.node}} />`);

        assert.dom('[data-test-node-navbar-link-wiki]').exists('Wiki link exists');
    });

    test('it omits the wiki link when the wiki is disabled', async function(assert) {
        this.set('node', { wikiEnabled: false });

        await render(hbs`<NodeNavbar @renderInPlace={{true}} @node={{this.node}} />`);

        assert.dom('[data-test-node-navbar-link-wiki]').doesNotExist('Wiki link does not exist');
    });
});
