import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';
import 'qunit-dom';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | delete-node-modal', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.set('delete', () => true);
        this.set('closeModal', () => true);
    });

    test('hidden by default', async function(assert) {
        await render(hbs`{{delete-node-modal closeModal=closeModal delete=delete}}`);
        assert.dom(this.element).hasText('');
    });

    test('shown when openModal=true', async function(assert) {
        await render(hbs`{{delete-node-modal closeModal=closeModal delete=delete openModal=true}}`);
        assert.dom(this.element).includesText('Are you sure you want to delete this project?');
    });
});
