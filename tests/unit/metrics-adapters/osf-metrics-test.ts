import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import OsfMetricsAdapter from 'ember-osf-web/metrics-adapters/osf-metrics';

module('Unit | Metrics Adapter | osf-metrics ', hooks => {
    setupTest(hooks);
    setupMirage(hooks);

    test('it exists', function(this: TestContext, assert) {
        assert.ok(this.owner.lookup('metrics-adapter:osf-metrics') instanceof OsfMetricsAdapter);
    });

    test('trackPage', async function(this: TestContext, assert) {
        assert.ok(server.schema.countedUsages.all().length === 0);
        const osfMetrics: OsfMetricsAdapter = this.owner.lookup('metrics-adapter:osf-metrics');
        await osfMetrics.trackPage();
        assert.ok(server.schema.countedUsages.all().length === 1);
        const {attrs} = server.schema.countedUsages.first();
        assert.ok(attrs.pageview_info.page_url === document.URL);
    });
});
