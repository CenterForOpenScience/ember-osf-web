import Service from '@ember/service';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { percySnapshot } from 'ember-percy';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

const routerStub = Service.extend({
    currentURL: '/',
    urlFor() {
        return '/FakeURL';
    },
    isActive() {
        return false;
    },
});

const sessionStub = Service.extend({
    isAuthenticated: false,
    on: () => { /* stub */ },
});

module('Integration | Component | osf-navbar', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: TestContext) {
        // Make sure currentURL is always a string
        this.owner.register('service:router', routerStub);
        this.owner.register('service:session', sessionStub);
    });

    test('it renders', async assert => {
        await render(hbs`<OsfNavbar />`);
        assert.dom('.service-name').includesText('OSF');
        assert.dom('.current-service').hasText('HOME');
    });

    test('service-dropdown: logged in', async function(assert) {
        this.owner.lookup('service:session').set('isAuthenticated', true);
        await render(hbs`<OsfNavbar />`);

        assert.dom('[data-test-service-dropdown]').exists();

        await click('[data-test-service-dropdown]');
        await percySnapshot(assert);
    });

    test('auth-dropdown: logged in', async function(assert) {
        this.owner.lookup('service:session').set('isAuthenticated', true);

        await render(hbs`<OsfNavbar />`);

        assert.dom('[data-test-auth-dropdown-toggle]').exists();
        await click('[data-test-auth-dropdown-toggle]');
        await percySnapshot(assert);
    });

    test('osf-navbar: logged out', async function(assert) {
        this.owner.lookup('service:session').set('isAuthenticated', false);

        await render(hbs`<OsfNavbar />`);
        assert.dom('[data-test-service-dropdown]').exists();

        assert.dom('[data-test-auth-dropdown-toggle]').doesNotExist();
        assert.dom('[data-test-ad-sign-up-button]').exists();
        assert.dom('[data-test-sign-in-button]').exists();

        await click('[data-test-service-dropdown]');
        await percySnapshot(assert);
    });
});
