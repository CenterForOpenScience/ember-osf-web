import { settled } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupTest } from 'ember-qunit';
import { module, skip, test } from 'qunit';

import config from 'ember-osf-web/config/environment';

const {
    OSF: {
        dataciteTrackerRepoId,
        dataCiteTrackerUrl,
    },
} = config;

module('Unit | Service | analytics', hooks => {
    setupTest(hooks);
    setupMirage(hooks);

    test('trackPage', async function(assert) {
        const service = this.owner.lookup('service:analytics');
        assert.strictEqual(server.schema.countedUsages.all().length, 0, 'start with no counted usage');
        await service.trackPage();
        await settled();
        assert.strictEqual(server.schema.countedUsages.all().length, 1, 'end with one counted usage');
        const savedCountedUsage = server.schema.countedUsages.first();
        assert.strictEqual(savedCountedUsage.pageviewInfo.page_url, document.URL, 'correct url');
    });

    skip('track datacite usage', async function(assert) {
        const _actualDataciteTrackerRepoId = dataciteTrackerRepoId;
        const _actualDataCiteTrackerUrl = dataCiteTrackerUrl;

        const itemGuid = '12345';
        const itemDoi = '10.1234/123456';

        config.OSF.dataCiteTrackerUrl = 'https://api.datacite.org/trackers/';
        config.OSF.dataciteTrackerRepoId = itemGuid;

        const service = this.owner.lookup('service:analytics');

        service._getDoiForGuid = () => itemDoi;
        service._getRouteMetricsMetadata = () => ({
            itemGuid,
        });

        const requestBodyList: any[] = [];
        server.post(
            config.OSF.dataCiteTrackerUrl,
            function(_, request) {
                requestBodyList.push(JSON.parse(request.requestBody));
            },
            201,
        );
        assert.strictEqual(server.schema.countedUsages.all().length, 0, 'start with no counted usage');
        await service.trackPage();
        await settled();

        /*
        * Reimplements Datacite's usage tracking API.
        * https://github.com/datacite/datacite-tracker/blob/main/src/lib/request.ts
        */
        assert.deepEqual(requestBodyList, [{
            n: 'view',
            u: location.href,
            i: itemGuid,
            p: itemDoi,
        }], 'It tracks page view');
        assert.strictEqual(server.schema.countedUsages.all().length, 1, 'end with one counted usage');

        await service.trackDownload(itemGuid, itemDoi);
        await settled();
        assert.deepEqual(requestBodyList[1], {
            n: 'download',
            u: location.href,
            i: itemGuid,
            p: itemDoi,
        }, 'It tracks download');

        config.OSF.dataCiteTrackerUrl = _actualDataciteTrackerRepoId;
        config.OSF.dataciteTrackerRepoId = _actualDataCiteTrackerUrl;
    });
});
