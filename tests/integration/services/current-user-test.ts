import { Request } from 'ember-cli-mirage';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import config from 'ember-get-config';
import { TestContext } from 'ember-intl/test-support';
import { startMirage } from 'ember-osf-web/initializers/ember-cli-mirage';
import CurrentUserService from 'ember-osf-web/services/current-user';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

const { OSF: { apiUrl, apiVersion } } = config;

type ExtendedTestContext = TestContext & { currentUser: CurrentUserService };

module('Integration | Service | current-user', hooks => {
    setupTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: ExtendedTestContext) {
        this.store = this.owner.lookup('service:store');
        this.currentUser = this.owner.lookup('service:current-user');
    });

    test('includes version in headers', async function(this: ExtendedTestContext, assert) {
        assert.expect(4);
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
        const dummyEndpoint = (_: any, request: Request & { requestHeaders: { Accept: string } }) => {
            assert.equal(request.requestHeaders.Accept, acceptHeaderExpected);
            return fakeResponse;
        };
        server.get('/users', dummyEndpoint);
        server.post('/users', dummyEndpoint);
        server.get('/fakeEndpoint', dummyEndpoint);
        server.post('/fakeEndpoint', dummyEndpoint);
        await this.store.findAll('user');
        await this.store.createRecord('user').save();
        const fakeEndpointUrl = `${apiUrl}/v2/fakeEndpoint`;
        await this.currentUser.authenticatedAJAX({
            url: fakeEndpointUrl,
            type: 'GET',
        });
        await this.currentUser.authenticatedAJAX({
            url: fakeEndpointUrl,
            type: 'POST',
        });
    });
});
