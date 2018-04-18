import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | simple-paginator', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function() {
        this.set('stubAction', () => {}); // tslint:disable-line no-empty
    });

    test('it renders', async function(assert) {
        await render(hbs`{{simple-paginator nextPage=stubAction previousPage=stubAction}}`);
        assert.equal(this.element.textContent.trim(), '');
    });
});
