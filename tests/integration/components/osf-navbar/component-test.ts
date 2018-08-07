import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | osf-navbar', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        this.set('loginAction', () => { /* stub */ });
        await render(hbs`{{osf-navbar loginAction=loginAction}}`);
        assert.dom('.service-name').includesText('OSF');
        assert.dom('.current-service').hasText('HOME');
    });
});
