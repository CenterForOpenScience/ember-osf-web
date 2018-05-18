import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import injectCustomAssertions from 'ember-osf-web/tests/helpers/inject-custom-assertions';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | loading indicator', function(hooks) {
    setupRenderingTest(hooks);
    injectCustomAssertions(hooks);

    test('light', async function(assert) {
        await render(hbs`{{loading-indicator}}`);
        assert.hasText(this.element, '', 'is empty element');
        assert.hasClass(this.element.querySelector('div.ball-scale'), 'ball-light');
    });

    test('dark', async function(assert) {
        await render(hbs`{{loading-indicator dark=true}}`);
        assert.hasText(this.element, '', 'is empty element');
        assert.hasClass(this.element.querySelector('div.ball-scale'), 'ball-dark');
    });
});
