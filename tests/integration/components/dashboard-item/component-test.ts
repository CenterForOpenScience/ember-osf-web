import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import FakeNode from '../../helpers/fake-node';

module('Integration | Component | dashboard-item', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        const node = new FakeNode();
        this.set('node', node);
        await render(hbs`<DashboardItem @node={{this.node}} />`);
        assert.dom('div.ember-view > a  > div[class*="_DashboardItem_"]').exists();
        assert.dom('[data-test-dashboard-item-title]').containsText(node.title, 'Title is set properly');
        assert.dom(`a[href*="${node.links.html}"]`).exists('Link goes to the node\'s html link');
    });
});
