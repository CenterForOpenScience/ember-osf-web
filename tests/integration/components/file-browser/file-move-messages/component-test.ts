import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import Node from 'ember-osf-web/models/node';
import { StorageStatus, TestCases } from 'ember-osf-web/models/node-storage';
import { Permission } from 'ember-osf-web/models/osf-model';
import User from 'ember-osf-web/models/user';

interface ThisTestContext extends TestContext {
    user: ModelInstance<User>;
    node: ModelInstance<Node>;
}

module('Integration | Component | file-browser | file-move-messages', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: ThisTestContext) {
        this.store = this.owner.lookup('service:store');
        const mirageUser = server.create('user');
        this.user = mirageUser;
        const project = server.create('node', {
            id: 'aaaaa',
            currentUserPermissions: Object.values(Permission),
        }, 'withStorage');
        server.create('contributor', {
            node: project,
            users: mirageUser,
            permission: Permission.Admin,
            index: 0,
        });
        this.node = project;
    });

    const statuses = Object.values(StorageStatus) as StorageStatus[];
    for (const status of statuses) {
        test(`Public project with storage ${status}`, async function(this: ThisTestContext, assert) {
            const nodeStorage = this.node.storage.update({ storageLimitStatus: status });
            this.node.update({ storage: nodeStorage });

            const selected = await this.store.findRecord('node', this.node.id, { include: 'storage' });
            this.set('selected', selected);

            await render(hbs`<FileBrowser::FileMoveMessages @project={{this.selected}} />`);

            if (TestCases.public[status].error) {
                assert.dom('[data-test-file-move-error]').exists();
            } else {
                assert.dom('[data-test-file-move-error]').doesNotExist();
            }
            if (TestCases.public[status].warning) {
                assert.dom('[data-test-file-move-warning]').exists();
            } else {
                assert.dom('[data-test-file-move-warning]').doesNotExist();
            }
            assert.dom('[data-test-no-longer-public]').doesNotExist();
        });
        test(`Private project with storage ${status}`, async function(this: ThisTestContext, assert) {
            const nodeStorage = this.node.storage.update({ storageLimitStatus: status });
            this.node.update({ public: false, storage: nodeStorage });

            const selected = await this.store.findRecord('node', this.node.id, { include: 'storage' });
            this.set('selected', selected);

            await render(hbs`<FileBrowser::FileMoveMessages @project={{this.selected}} />`);

            if (TestCases.private[status].error) {
                assert.dom('[data-test-file-move-error]').exists();
            } else {
                assert.dom('[data-test-file-move-error]').doesNotExist();
            }
            if (TestCases.private[status].warning) {
                assert.dom('[data-test-file-move-warning]').exists();
            } else {
                assert.dom('[data-test-file-move-warning]').doesNotExist();
            }
            assert.dom('[data-test-no-longer-public]').exists();
        });
    }
});
