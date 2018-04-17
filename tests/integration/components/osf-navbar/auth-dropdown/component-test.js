import Service from '@ember/service';
import { render, click } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

const sessionStub = Service.extend({
    isAuthenticated: false,
    on: () => {},
});

const routerStub = Service.extend({
    transitionTo: () => null,
    generateURL: () => 'url!',
});

module('Integration | Component | osf-navbar/auth-dropdown', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function() {
        this.owner.register('service:session', sessionStub);

        // Prevent trying to actually transition
        this.owner.register('service:-routing', routerStub);

        this.setProperties({
            loginActionCalled: false,
            onLinkClickedCalled: false,
            actions: {
                loginAction: () => {
                    this.set('loginActionCalled', true);
                },
                onLinkClicked: () => {
                    this.set('onLinkClickedCalled', true);
                },
            },
        });
    });

    test('loginAction called', async function(assert) {
        await render(hbs`{{osf-navbar/auth-dropdown loginAction=(action 'loginAction')}}`);

        assert.ok(!this.get('loginActionCalled'));
        await click('.btn-top-login');
        assert.ok(this.get('loginActionCalled'));
    });

    test('onLinkClicked called', async function(assert) {
        this.owner.lookup('service:session').set('isAuthenticated', true);

        await render(hbs`{{osf-navbar/auth-dropdown onLinkClicked=(action 'onLinkClicked')}}`);

        assert.ok(!this.get('onLinkClickedCalled'));
        await click('.fa-life-ring');
        assert.ok(this.get('onLinkClickedCalled'));
    });
});
