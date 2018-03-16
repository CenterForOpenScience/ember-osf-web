import Service from '@ember/service';
import { render, click } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

const sessionStub = Service.extend({
    isAuthenticated: false,
});

module('Integration | Component | osf-navbar/auth-dropdown', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function() {
        this.owner.register('service:session', sessionStub);

        this.setProperties({
            loginActionCalled: false,
            dropdownOpenedCalled: false,
            actions: {
                loginAction: () => {
                    this.set('loginActionCalled', true);
                },
                dropdownOpened: () => {
                    this.set('dropdownOpenedCalled', true);
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

    test('dropdownOpened called', async function(assert) {
        this.owner.lookup('service:session').set('isAuthenticated', true);

        await render(hbs`{{osf-navbar/auth-dropdown dropdownOpened=(action 'dropdownOpened')}}`);

        assert.ok(!this.get('dropdownOpenedCalled'));
        await click('.nav-profile-name');
        assert.ok(this.get('dropdownOpenedCalled'));
    });
});
