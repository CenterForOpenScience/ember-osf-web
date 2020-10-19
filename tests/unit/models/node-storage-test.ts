import { get } from '@ember/object';
import { run } from '@ember/runloop';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { StorageStatus } from 'ember-osf-web/models/node-storage';
import { TestCases } from 'ember-osf-web/tests/fixtures/storage-statuses';

module('Unit | Model | node-storage', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('node-storage'));
        assert.ok(!!model);
    });

    const statuses = Object.values(StorageStatus) as StorageStatus[];
    for (const status of statuses) {
        test(`Public project with storage ${status}`, async function(assert) {
            const store = this.owner.lookup('service:store');
            const nodeStorage = run(() => store.createRecord('node-storage', {
                storageLimitStatus: status,
                id: 'public',
            }));
            run(() => store.createRecord('node', {
                storage: nodeStorage,
                public: true,
                id: 'public',
            }));
            if (TestCases.public[status].error) {
                assert.ok(get(nodeStorage, 'isOverStorageCap'));
            } else {
                assert.notOk(get(nodeStorage, 'isOverStorageCap'));
            }
            if (TestCases.public[status].warning) {
                assert.ok(get(nodeStorage, 'isApproachingStorageCap'));
            } else {
                assert.notOk(get(nodeStorage, 'isApproachingStorageCap'));
            }
        });
        test(`Private project with storage ${status}`, async function(assert) {
            const store = this.owner.lookup('service:store');
            const nodeStorage = run(() => store.createRecord('node-storage', {
                storageLimitStatus: status,
                id: 'private',
            }));
            run(() => store.createRecord('node', {
                storage: nodeStorage,
                public: false,
                id: 'private',
            }));

            if (TestCases.private[status].error) {
                assert.ok(get(nodeStorage, 'isOverStorageCap'));
            } else {
                assert.notOk(get(nodeStorage, 'isOverStorageCap'));
            }
            if (TestCases.private[status].warning) {
                assert.ok(get(nodeStorage, 'isApproachingStorageCap'));
            } else {
                assert.notOk(get(nodeStorage, 'isApproachingStorageCap'));
            }
        });
    }
});
