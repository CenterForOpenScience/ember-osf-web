import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import 'qunit-dom';

module('Integration | Component | dashboard-item', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async assert => {
        await render(hbs`{{dashboard-item}}`);
        assert.dom('div.ember-view > a  > div[class*="_DashboardItem_"]').exists();
    });
});
