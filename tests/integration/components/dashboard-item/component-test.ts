import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | dashboard item', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async assert => {
        await render(hbs`{{dashboard-item}}`);
        assert.found('div.ember-view > a  > div[class*="_DashboardItem_"]');
    });
});
