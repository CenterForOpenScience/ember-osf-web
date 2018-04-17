import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | simple-paginator', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        await render(hbs`{{simple-paginator}}`);
        assert.equal(this.element.textContent.trim(), '');
    });
});
