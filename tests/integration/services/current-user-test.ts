import { Request } from 'ember-cli-mirage';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import config from 'ember-get-config';
import { TestContext } from 'ember-intl/test-support';
import { startMirage } from 'ember-osf-web/initializers/ember-cli-mirage';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

const { OSF: { apiUrl, apiVersion } } = config;

module('Integration | Service | current-user', hooks => {
    setupTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
    });

    test('includes version in headers', async function(this: TestContext, assert) {
        const server = startMirage();
        server.urlPrefix = apiUrl;
        server.namespace = '/v2';
        const fakeResponse = {
            data: {
                attributes: '',
                type: 'users',
                id: 'fakeid',
            },
        };
        const acceptHeaderExpected = `application/vnd.api+json; version=${apiVersion}`;
        server.get('/users', (_: any, request: Request & { requestHeaders: { Accept: string } }) => {
            assert.equal(request.requestHeaders.Accept, acceptHeaderExpected);
            return fakeResponse;
        });
        server.post('/users', (_: any, request: Request & { requestHeaders: { Accept: string } }) => {
            assert.equal(request.requestHeaders.Accept, acceptHeaderExpected);
            return fakeResponse;
        });
        this.store.findAll('user');
        this.store.createRecord('user').save();
        assert.expect(2);
    });
});
