import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupIntl, t } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';

import { module, test } from 'qunit';

module('Integration | Component | delete-node-modal', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.set('delete', () => true);
        this.set('closeModal', () => true);
    });

    test('hidden by default', async function(assert) {
        await render(hbs`{{delete-node-modal closeModal=this.closeModal delete=this.delete}}`);
        assert.dom(this.element).hasText('');
    });

    test('shown when openModal=true', async function(assert) {
        await render(hbs`{{delete-node-modal closeModal=this.closeModal delete=this.delete openModal=true}}`);
        assert.dom('[data-test-delete-warning]').includesText(
            t('delete_modal.title', { nodeType: 'project' }).toString(),
        );
    });
});
