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

type testKeys = 'default' | 'approachingPrivate' | 'overPrivate' | 'approachingPublic' | 'overPublic';

const testCases: Record<'public' | 'private', Record<testKeys, { warning: boolean, error: boolean }>> = {
    public: {
        default: {
            warning: false,
            error: false,
        },
        approachingPrivate: {
            warning: false,
            error: false,
        },
        overPrivate: {
            warning: false,
            error: false,
        },
        approachingPublic: {
            warning: true,
            error: false,
        },
        overPublic: {
            warning: false,
            error: true,
        },
    },
    private: {
        default: {
            warning: false,
            error: false,
        },
        approachingPrivate: {
            warning: true,
            error: false,
        },
        overPrivate: {
            warning: false,
            error: true,
        },
        approachingPublic: {
            warning: false,
            error: true,
        },
        overPublic: {
            warning: false,
            error: true,
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

    const statuses = Object.values(StorageStatus) as testKeys[];
    for (const status of statuses) {
        test(`Public project with storage ${status}`, async function(this: ThisTestContext, assert) {
            this.set('user', this.user);
            let nodeStorage = null;
            if (status === StorageStatus.DEFAULT) {
                nodeStorage = server.create('node-storage');
            } else {
                nodeStorage = server.create('node-storage', status);
            }
            this.node.update({ storage: nodeStorage });
            const selected = await this.store.findRecord('node', this.node.id, { include: 'storage' });
            this.set('selected', selected);
            await render(hbs`<FileBrowser::FileMoveMessages @selected={{this.selected}} />`);
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
            this.set('user', this.user);
            let nodeStorage = null;
            if (status === StorageStatus.DEFAULT) {
                nodeStorage = server.create('node-storage');
            } else {
                nodeStorage = server.create('node-storage', status);
            }
            this.node.public = false;
            this.node.update({ storage: nodeStorage });
            const selected = await this.store.findRecord('node', this.node.id, { include: 'storage' });
            this.set('selected', selected);
            await render(hbs`<FileBrowser::FileMoveMessages @selected={{this.selected}} />`);
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
