import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | delete-node-modal', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function() {
        this.set('delete', () => {}); // tslint:disable-line no-empty
        this.set('closeModal', () => {}); // tslint:disable-line no-empty
    });

    test('it renders', async function(assert) {
        await render(hbs`{{delete-node-modal closeModal=closeModal delete=delete}}`);
        assert.equal(this.element.textContent.trim(), '');

        await render(hbs`{{delete-node-modal closeModal=closeModal delete=delete openModal=true}}`);
        assert.ok(this.element.textContent.trim());
    });
});
