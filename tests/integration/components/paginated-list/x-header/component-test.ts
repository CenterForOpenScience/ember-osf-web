import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | paginated-list/x-header', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        await render(hbs`<PaginatedList::XItem />`);

        assert.dom(this.element).hasText('');

        await render(hbs`
            <PaginatedList::XItem>
                template block text
            </PaginatedList::XItem>
        `);

        assert.dom(this.element).hasText('template block text');
    });
});
