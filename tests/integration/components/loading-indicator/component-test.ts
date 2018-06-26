import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | loading-indicator', hooks => {
    setupRenderingTest(hooks);

    test('light', async function(assert) {
        await render(hbs`{{loading-indicator}}`);
        assert.notHasText(this.element);
        assert.hasClass(this.element.querySelector('div.ball-scale'), 'ball-light');
    });

    test('dark', async function(assert) {
        await render(hbs`{{loading-indicator dark=true}}`);
        assert.notHasText(this.element);
        assert.hasClass(this.element.querySelector('div.ball-scale'), 'ball-dark');
    });
});
