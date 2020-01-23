import { render } from '@ember/test-helpers';
import { t } from 'ember-i18n/test-support';
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

    test('hidden by default', async function(assert) {
        await render(hbs`{{delete-node-modal closeModal=closeModal delete=delete}}`);
        assert.dom(this.element).hasText('');
    });

    test('shown when openModal=true', async assert => {
        await render(hbs`{{delete-node-modal closeModal=closeModal delete=delete openModal=true}}`);
        assert.dom('[data-test-delete-warning]').includesText(
            t('delete_modal.title', { nodeType: 'project' }).toString(),
        );
    });
});
