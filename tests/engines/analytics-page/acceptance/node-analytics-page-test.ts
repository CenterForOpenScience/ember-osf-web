import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
import { currentRouteName } from '@ember/test-helpers/setup-application-context';

module('Analytics Page | Acceptance | node-analytics-page', hooks => {
    setupEngineApplicationTest(hooks, 'guid-node.analytics');
    setupMirage(hooks);

    test('it loads', async assert => {
        const node = server.create('node');
        await visit(`/${node.id}/analytics`);
        assert.equal(currentRouteName(), 'guid-node.analytics.index');
        assert.dom('[data-test-analytics-chart="unique_visits"]').exists();
        assert.dom('[data-test-analytics-chart="time_of_day"]').exists();
        assert.dom('[data-test-analytics-chart="referer_domain"]').exists();
        assert.dom('[data-test-analytics-chart="popular_pages"]').exists();
        await percySnapshot(assert);
    });
});
