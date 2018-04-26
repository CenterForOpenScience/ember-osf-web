import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | osf-footer', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        await render(hbs`{{osf-footer}}`);
        assert.ok((this.element.textContent as string).trim());
    });
});
