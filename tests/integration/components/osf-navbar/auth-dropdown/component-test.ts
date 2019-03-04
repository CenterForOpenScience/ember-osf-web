import Service from '@ember/service';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import { click } from 'ember-osf-web/tests/helpers';

import { OsfLinkRouterStub } from '../../../helpers/osf-link-router-stub';

const sessionStub = Service.extend({
    isAuthenticated: false,
    on: () => { /* stub */ },
});

const routingStub = Service.extend({
    transitionTo: () => null,
    generateURL: () => 'url!',
});

module('Integration | Component | osf-navbar/auth-dropdown', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.owner.register('service:session', sessionStub);

        // Prevent trying to actually transition
        this.owner.register('service:-routing', routingStub);

        // Make sure currentURL is always a string
        this.owner.register('service:router', OsfLinkRouterStub);
    });

    test('login called', async function(assert) {
        this.owner.register('service:currentUser', Service.extend({
            loginCalled: false,
            login() {
                this.set('loginCalled', true);
            },
        }));

        await render(hbs`{{osf-navbar/auth-dropdown}}`);

        assert.ok(!this.owner.lookup('service:currentUser').loginCalled, 'login has not been called');
        await click('[data-analytics-name="SignIn"]');
        assert.ok(this.owner.lookup('service:currentUser').loginCalled, 'login was called');
    });
});
