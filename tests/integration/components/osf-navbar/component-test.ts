import Service from '@ember/service';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupIntl } from 'ember-intl/test-support';
import { percySnapshot } from 'ember-percy';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

const routerStub = Service.extend({
    currentURL: '/',
    currentRouteName: 'dashboard',
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
    setupIntl(hooks);

    hooks.beforeEach(function(this: TestContext) {
        // Make sure currentURL is always a string
        this.owner.unregister('service:router');
        this.owner.register('service:router', routerStub);
        this.owner.register('service:session', sessionStub);
    });

    test('it renders', async function(assert) {
        await render(hbs`<OsfNavbar />`);
        assert.dom('.service-name').includesText('OSF');
        assert.dom('.current-service').hasText('HOME');
        assert.dom('[data-test-nav-my-projects-link]').exists();
        assert.dom('[data-test-nav-search-link]').exists();
        assert.dom('[data-test-nav-support-link]').exists();
        assert.dom('[data-test-nav-donate-link]').exists();
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

    test('osf-navbar: preprints, no moderation', async function(assert) {
        this.owner.lookup('service:session').set('isAuthenticated', true);
        this.owner.lookup('service:router').set('currentRouteName', 'preprints.place');

        await render(hbs`<OsfNavbar />`);

        assert.dom('.service-name').includesText('OSF');
        assert.dom('.current-service').hasText('PREPRINTS');
        assert.dom('[data-test-nav-my-preprints-link]').exists();
        assert.dom('[data-test-nav-submit-preprint-link]').exists();
        assert.dom('[data-test-nav-reviews-link]').doesNotExist();

        assert.dom('[data-test-nav-search-link]').exists();
        assert.dom('[data-test-nav-donate-link]').hasClass('navbar-donate-button');

        assert.dom('[data-test-nav-my-projects-link]').doesNotExist();
    });

    test('osf-navbar: preprints with moderation', async function(assert) {
        this.owner.lookup('service:session').set('isAuthenticated', true);
        this.owner.lookup('service:router').set('currentRouteName', 'preprints.somewhere');
        // this.owner.register('service:current-user', currentUserStub);
        this.owner.lookup('service:current-user').set('user', { canViewReviews: true });

        await render(hbs`<OsfNavbar />`);

        assert.dom('.service-name').includesText('OSF');
        assert.dom('.current-service').hasText('PREPRINTS');
        assert.dom('[data-test-nav-my-preprints-link]').exists();
        assert.dom('[data-test-nav-submit-preprint-link]').exists();
        assert.dom('[data-test-nav-reviews-link]').exists();

        assert.dom('[data-test-nav-my-projects-link]').doesNotExist();
        await percySnapshot(assert);
    });
});
