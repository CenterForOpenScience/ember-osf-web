import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | delete-node-modal', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.set('delete', () => true);
        this.set('closeModal', () => true);
    });

    test('it renders', async function(assert) {
        await render(hbs`{{delete-node-modal closeModal=closeModal delete=delete}}`);
        assert.equal((this.element.textContent as string).trim(), '');

        await render(hbs`{{delete-node-modal closeModal=closeModal delete=delete openModal=true}}`);
        assert.ok((this.element.textContent as string).trim());
    });
});
