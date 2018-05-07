import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | osf navbar', function(hooks) {
    setupRenderingTest(hooks);


    test('it renders', async function(assert) {
        this.set('loginAction', () => {});
        await render(hbs`{{osf-navbar loginAction=loginAction}}`);
        assert.ok(this.$().text().replace(/\s+/g, ' ').includes('OSF'));
    });
});
