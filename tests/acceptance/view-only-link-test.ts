import { Request } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import config from 'ember-get-config';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';
import sinon, { SinonStub } from 'sinon';

import { click, currentURL, visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
import WindowLocation from 'ember-osf-web/utils/window-location';

const {
    OSF: {
        url: osfUrl,
        apiUrl,
    },
} = config;

interface ViewOnlyTestContext extends TestContext {
    assignLocationStub: SinonStub;
}

module('Acceptance | view-only-links', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    hooks.beforeEach(function(this: ViewOnlyTestContext) {
        this.assignLocationStub = sinon.stub(WindowLocation, 'assignLocation');
    });

    hooks.afterEach(function(this: ViewOnlyTestContext) {
        this.assignLocationStub.restore();
    });

    test('View-only links', async assert => {
        server.create('root', 'withAnonymizedVOL');
        const viewOnlyToken = 'thisisatoken';

        const requests: Request[] = [];
        server.pretender.handledRequest = (_: string, __: string, request: Request) => {
            requests.push(request);
        };

        await visit(`/?view_only=${viewOnlyToken}`);

        assert.ok(requests.length > 2, 'Successfully collected requests');

        const [bootRequest1, bootRequest2, ...otherRequests] = requests;

        assert.ok(
            bootRequest1.url.split('?')[0] === `${apiUrl}/v2/`
            && bootRequest1.queryParams.view_only === viewOnlyToken,
            `First API request is root boot with VOL: ${bootRequest1.url}`,
        );

        assert.ok(
            bootRequest2.url.split('?')[0] === `${apiUrl}/v2/`
            && !bootRequest2.queryParams.view_only,
            `Second API request is root boot without VOL: ${bootRequest2.url}`,
        );

        for (const request of otherRequests) {
            assert.equal(request.queryParams.view_only, viewOnlyToken, 'VOL token passed to API');
        }

        const anchors = document.querySelectorAll('[data-test-application] a[href]');
        assert.ok(anchors.length > 1, 'Successfully collected anchors');

        const paramRegex = new RegExp(`view_only=${viewOnlyToken}`);
        anchors.forEach(anchor => {
            const href = anchor.getAttribute('href');
            if (href) {
                if (href.startsWith('/') || href.startsWith(osfUrl)) {
                    assert.ok(paramRegex.test(href), `OSF link has VOL token: ${href}`);
                } else {
                    assert.notOk(paramRegex.test(href), `Non-OSF link does not have VOL token: ${href}`);
                }
            }
        });
    });

    test('View-only banner (logged in, non-anonymized)', async function(this: ViewOnlyTestContext, assert: Assert) {
        server.create('root');

        const viewOnlyToken = 'thisisatoken';
        await visit(`/support?view_only=${viewOnlyToken}`);

        assert.equal(currentURL(), `/support?view_only=${viewOnlyToken}`);
        assert.dom('[data-test-view-normally]').exists({ count: 1 });

        await click('[data-test-view-normally]');

        assert.ok(this.assignLocationStub.calledWith('/?view_only='));
    });

    test('View-only banner (logged in, anonymized)', async function(this: ViewOnlyTestContext, assert: Assert) {
        server.create('root', 'withAnonymizedVOL');

        const viewOnlyToken = 'thisisatoken';
        await visit(`/support?view_only=${viewOnlyToken}`);

        assert.equal(currentURL(), `/support?view_only=${viewOnlyToken}`);
        assert.dom('[data-test-view-normally]').exists({ count: 1 });

        await click('[data-test-view-normally]');

        assert.ok(this.assignLocationStub.calledWith('/?view_only='));
    });

    test('View-only banner (logged out, non-anonymized)', async function(this: ViewOnlyTestContext, assert: Assert) {
        server.create('root', 'loggedOut');

        const viewOnlyToken = 'thisisatoken';
        await visit(`/support?view_only=${viewOnlyToken}`);

        assert.equal(currentURL(), `/support?view_only=${viewOnlyToken}`);
        assert.dom('[data-test-view-normally]').exists({ count: 1 });

        await click('[data-test-view-normally]');

        assert.ok(this.assignLocationStub.calledWith('/?view_only='));
    });

    test('View-only banner (logged out, anonymized)', async function(this: ViewOnlyTestContext, assert: Assert) {
        server.create('root', 'loggedOut', 'withAnonymizedVOL');

        const viewOnlyToken = 'thisisatoken';
        await visit(`/support?view_only=${viewOnlyToken}`);

        assert.equal(currentURL(), `/support?view_only=${viewOnlyToken}`);
        assert.dom('[data-test-view-normally]').exists({ count: 1 });

        await click('[data-test-view-normally]');

        assert.ok(this.assignLocationStub.calledWith('/?view_only='));
    });

    test('Transition from project to registration does not add bad VOL', async assert => {
        const mirageProject = server.create('node', 'currentUserAdmin');
        const mirageRegistration = server.create('registration', {
            registeredFrom: mirageProject,
        }, 'currentUserAdmin');

        await visit(`/${mirageProject.id}/registrations`);
        await click('[data-test-node-card-heading] a');

        assert.equal(currentURL(), `/--registries/${mirageRegistration.id}`, 'URL does not have view_only');
    });
});
