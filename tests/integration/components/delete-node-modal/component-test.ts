import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | delete-node-modal', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.set('delete', () => true);
        this.set('closeModal', () => true);
    });

    test('hidden by default', async function(assert) {
        await render(hbs`{{delete-node-modal closeModal=closeModal delete=delete}}`);
        assert.notHasText(this.element);
    });

    test('shown when openModal=true', async function(assert) {
        await render(hbs`{{delete-node-modal closeModal=closeModal delete=delete openModal=true}}`);
        assert.includesText(this.element, 'Are you sure you want to delete this project?');
    });
});
