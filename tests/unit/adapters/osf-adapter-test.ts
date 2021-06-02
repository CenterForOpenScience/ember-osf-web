import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

module('Unit | Adapter | osf-adapter', hooks => {
    setupTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
    });

    test('it exists', function(assert) {
        const adapter = this.owner.lookup('adapter:osf-adapter');
        assert.ok(adapter);
    });

    test('#buildURL uses relationship links if available for delete, update, and find', async function(assert) {
        const url = 'http://localhost:8000/v2/users/me/rel/';
        const adapter = this.owner.lookup('adapter:osf-adapter');
        const mirageUser = server.create('user');
        const user = await this.store.findRecord('user', mirageUser.id);
        user.set('links', { self: url });

        ['delete', 'update', 'find'].forEach(verb => {
            const result = adapter.buildURL(
                'user',
                'me',
                // @ts-ignore -- Private API
                user._internalModel.createSnapshot(),
                `${verb}Record`,
            );
            assert.equal(url, result);
        });
    });

    test('#buildURL uses snapshot.adapterOptions.url if available', async function(assert) {
        const url = 'http://localhost:8000/v2/users/me/rel/';
        const adapter = this.owner.lookup('adapter:osf-adapter');
        const mirageUser = server.create('user');
        const user = await this.store.findRecord('user', mirageUser.id);
        user.set('links', null);

        const result = adapter.buildURL(
            'user',
            'me',
            // @ts-ignore -- Private API
            user._internalModel.createSnapshot({
                adapterOptions: {
                    url,
                },
            }),
            'createRecord',
        );
        assert.equal(url, result);
    });

    test('#buildURL appends a trailing slash if missing', async function(assert) {
        const url = 'http://localhost:8000/v2/users/me';
        const adapter = this.owner.lookup('adapter:osf-adapter');
        const mirageUser = server.create('user');
        const user = await this.store.findRecord('user', mirageUser.id);

        const { buildURL: origBuildUrl } = JSONAPIAdapter.prototype;
        // Stub
        JSONAPIAdapter.prototype.buildURL = () => url;

        const result = adapter.buildURL(
            'user',
            'me',
            // @ts-ignore -- Private API
            user._internalModel.createSnapshot(),
            'findRecord',
        );
        assert.notEqual(url, result);
        assert.equal(result.slice(-1), '/');

        // Restore
        JSONAPIAdapter.prototype.buildURL = origBuildUrl;
    });

    test('#ajaxOptions adds bulk contentType if request is bulk', function(assert) {
        const adapter = this.owner.lookup('adapter:osf-adapter');
        const opts = adapter.ajaxOptions(null, null, {
            isBulk: true,
        });
        assert.equal(opts.contentType, 'application/vnd.api+json; ext=bulk');
    });
});
