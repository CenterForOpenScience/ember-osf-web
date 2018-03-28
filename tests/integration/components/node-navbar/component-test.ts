import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | node-navbar', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        await render(hbs`{{node-navbar renderInPlace=true}}`);

        assert.ok(this.element.textContent.trim());
    });

    test('it renders active tab when passing proper tab', async function(assert) {
        await render(hbs`{{node-navbar renderInPlace=true}}`);

        assert.ok(this.element.innerHTML.indexOf('active') === -1);

        await render(hbs`{{node-navbar renderInPlace=true active='wiki'}}`);

        assert.ok(this.element.innerHTML.indexOf('active') !== -1);

        await render(hbs`{{node-navbar renderInPlace=true active='notAtab'}}`);
        assert.ok(this.element.innerHTML.indexOf('active') === -1);
    });
});
