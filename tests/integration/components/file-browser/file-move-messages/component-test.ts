import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import Node from 'ember-osf-web/models/node';
import { StorageStatus } from 'ember-osf-web/models/node-storage';
import { Permission } from 'ember-osf-web/models/osf-model';
import User from 'ember-osf-web/models/user';

interface ThisTestContext extends TestContext {
    user: ModelInstance<User>;
    node: ModelInstance<Node>;
}

const testCases: Record<'public' | 'private', Record<StorageStatus, { warning: boolean, error: boolean }>> = {
    public: {
        DEFAULT: {
            warning: false,
            error: false,
        },
        APPROACHING_PRIVATE: {
            warning: false,
            error: false,
        },
        OVER_PRIVATE: {
            warning: false,
            error: false,
        },
        APPROACHING_PUBLIC: {
            warning: true,
            error: false,
        },
        OVER_PUBLIC: {
            warning: false,
            error: true,
        },
        NOT_CALCULATED: {
            warning: false,
            error: false,
        },
    },
    private: {
        DEFAULT: {
            warning: false,
            error: false,
        },
        APPROACHING_PRIVATE: {
            warning: true,
            error: false,
        },
        OVER_PRIVATE: {
            warning: false,
            error: true,
        },
        APPROACHING_PUBLIC: {
            warning: false,
            error: true,
        },
        OVER_PUBLIC: {
            warning: false,
            error: true,
        },
        NOT_CALCULATED: {
            warning: false,
            error: false,
        },
    },
};

module('Integration | Component | file-browser | file-move-messages', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: ThisTestContext) {
        this.store = this.owner.lookup('service:store');
        const mirageUser = server.create('user');
        this.user = mirageUser;
        const project = server.create('node', {
            currentUserPermissions: Object.values(Permission),
        });
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
            const nodeStorage = server.create('node-storage', { storageLimitStatus: status });
            this.node.update({ storage: nodeStorage });

            const selected = await this.store.findRecord('node', this.node.id, { include: 'storage' });
            this.set('selected', selected);

            await render(hbs`<FileBrowser::FileMoveMessages @project={{this.selected}} />`);

            if (testCases.public[status].error) {
                assert.dom('[data-test-file-move-error]').exists();
            } else {
                assert.dom('[data-test-file-move-error]').doesNotExist();
            }
            if (testCases.public[status].warning) {
                assert.dom('[data-test-file-move-warning]').exists();
            } else {
                assert.dom('[data-test-file-move-warning]').doesNotExist();
            }
            assert.dom('[data-test-no-longer-public]').doesNotExist();
        });
        test(`Private project with storage ${status}`, async function(this: ThisTestContext, assert) {
            const nodeStorage = server.create('node-storage', { storageLimitStatus: status });
            this.node.update({ public: false, storage: nodeStorage });

            const selected = await this.store.findRecord('node', this.node.id, { include: 'storage' });
            this.set('selected', selected);

            await render(hbs`<FileBrowser::FileMoveMessages @project={{this.selected}} />`);

            if (testCases.private[status].error) {
                assert.dom('[data-test-file-move-error]').exists();
            } else {
                assert.dom('[data-test-file-move-error]').doesNotExist();
            }
            if (testCases.private[status].warning) {
                assert.dom('[data-test-file-move-warning]').exists();
            } else {
                assert.dom('[data-test-file-move-warning]').doesNotExist();
            }
            assert.dom('[data-test-no-longer-public]').exists();
        });
    }
});
