import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import 'qunit-dom';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | status-banner', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        await render(hbs`{{status-banner}}`);
        assert.dom(this.element).hasText('');
    });
});
