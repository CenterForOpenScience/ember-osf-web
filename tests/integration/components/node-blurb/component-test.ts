import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | node-blurb', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        this.set('contributors', []);
        this.set('node', { queryHasMany: () => [] });
        await render(hbs`{{node-blurb contributors=contributors node=node}}`);

        assert.ok(this.element.textContent.trim());
    });
});
