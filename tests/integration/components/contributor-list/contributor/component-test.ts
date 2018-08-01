import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import 'qunit-dom';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | contributor-list/contributor', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        await render(hbs`{{contributor-list/contributor}}`);
        assert.dom(this.element).hasText('');
    });
});
