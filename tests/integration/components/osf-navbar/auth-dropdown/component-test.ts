import Service from '@ember/service';
import { click, render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import sinon from 'sinon';

const sessionStub = Service.extend({
    isAuthenticated: false,
    on: () => { /* stub */ },
});

const routingStub = Service.extend({
    transitionTo: () => null,
    generateURL: () => 'url!',
});

const routerStub = Service.extend({
    currentURL: '',
});

module('Integration | Component | osf-navbar/auth-dropdown', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.owner.register('service:session', sessionStub);

        // Prevent trying to actually transition
        this.owner.register('service:-routing', routingStub);

        // Make sure currentURL is always a string
        this.owner.register('service:router', routerStub);

        this.setProperties({
            onLinkClickedCalled: false,
            actions: {
                onLinkClicked: () => {
                    this.set('onLinkClickedCalled', true);
                },
            },
        });
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
        await click('[data-test-sign-in-button]');
        assert.ok(this.owner.lookup('service:currentUser').loginCalled, 'login was called');
    });

    test('onLinkClicked called', async function(assert) {
        this.owner.lookup('service:session').set('isAuthenticated', true);

        let clickCalled = false;
        sinon.stub(this.owner.lookup('service:analytics'), 'click').callsFake(() => {
            clickCalled = true;
        });

        await render(hbs`{{osf-navbar/auth-dropdown}}`);

        assert.ok(!clickCalled);
        await click('.fa-life-ring');
        assert.ok(clickCalled);
    });
});
