import { render } from '@ember/test-helpers';
import { findAll } from 'ember-native-dom-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | node-navbar', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        await render(hbs`{{node-navbar renderInPlace=true}}`);

        assert.ok(this.element.textContent.trim());
    });

    test('it renders active tab when passing proper tab', async assert => {
        await render(hbs`{{node-navbar renderInPlace=true}}`);

        assert.ok(!findAll('li.active').length);

        await render(hbs`{{node-navbar renderInPlace=true activeTab='wiki'}}`);

        assert.ok(findAll('li.active').length);
        assert.ok(findAll('li.active')[0].innerHTML.includes('wiki'));

        await render(hbs`{{node-navbar renderInPlace=true activeTab='notAtab'}}`);
        assert.ok(!findAll('li.active').length);
    });
});
