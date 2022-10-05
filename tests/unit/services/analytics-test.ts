import { settled } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

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
});
