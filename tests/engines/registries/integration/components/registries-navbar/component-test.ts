import Service from '@ember/service';
import { click, fillIn, render, triggerKeyEvent } from '@ember/test-helpers';
import config from 'ember-get-config';
import { t } from 'ember-i18n/test-support';
import { setupEngineRenderingTest } from 'ember-osf-web/tests/helpers/engines';
import { setBreakpoint } from 'ember-responsive/test-support';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import $ from 'jquery';
import { module, test } from 'qunit';
import sinon from 'sinon';

const { OSF: { url: osfUrl } } = config;

const statusMessagesStub = Service.extend({
    messages: [],

    getCookieMessages() {
        return [];
    },
});

const analyticsStub = Service.extend({
    actions: {
        // tslint:disable-next-line:no-empty
        click() { },
    },
});

const sessionStub = Service.extend({
    isAuthenticated: false,
    on: () => { /* stub */ },
});

const currentUserStub = Service.extend({
    user: {
        profileImage: 'example.png?',
    },

    async checkShowTosConsentBanner() { /* stub */ },
});

const featuresStub = Service.extend({
    isEnabled: () => false,
});

function visibleText(selector: string) {
    // https://stackoverflow.com/questions/1846177/how-do-i-get-just-the-visible-text-with-jquery-or-javascript
    return $(`${selector} *:not(:has(*)):visible`).text().replace(/\s+/g, ' ').trim();
}

/* tslint:disable:only-arrow-functions */
module('Registries | Integration | Component | registries-navbar', hooks => {
    setupEngineRenderingTest(hooks, 'registries');

    hooks.beforeEach(function(this: TestContext) {
        sinon.stub(this.owner.lookup('service:router'), 'urlFor').callsFake(
            (route: string, params?: { queryParams: object }) => {
                let url = `/${route}`;
                if (params && params.queryParams) {
                    const queryParamString = Object.entries(params.queryParams)
                        .map(([key, value]) => `${key}=${value}`).join('&');
                    url = `${url}?${queryParamString}`;
                }
                return url;
            },
        );
        sinon.stub(this.owner.lookup('service:router'), 'isActive').returns(false);
        sinon.stub(this.owner.lookup('service:router'), 'currentURL').get(() => '/FakeURL');
        sinon.stub(this.owner.lookup('service:router'), 'currentRouteName').get(() => 'FakeRoute');

        this.owner.register('service:session', sessionStub);
        this.owner.register('service:features', featuresStub);
        this.owner.register('service:analytics', analyticsStub);
        this.owner.register('service:currentUser', currentUserStub);
        this.owner.register('service:statusMessages', statusMessagesStub);
    });

    test('it renders', async assert => {
        await render(hbs`<RegistriesNavbar />`);

        assert.dom('nav[data-test-nav]').exists('The nav element is rendered');
    });

    test('desktop layout', async assert => {
        setBreakpoint('desktop');

        await render(hbs`<RegistriesNavbar />`);

        assert.equal(visibleText('[data-test-service]'), `${t('general.OSF')}${t('general.services.registries')}`);
        assert.dom('[data-test-search-bar]').isVisible('Search bar is visible');
        assert.dom('[data-test-search-bar-mobile]').isNotVisible('Mobile search bar is not visible on desktop');

        assert.dom('a[data-test-help]').isVisible('Help button is visible');
        assert.dom('a[data-test-help]').hasText(`${t('general.help')}`, 'Help button has correct text');

        assert.dom('a[data-test-donate]').isVisible('Donate button is visible');
        assert.dom('a[data-test-donate]').hasText(`${t('navbar.donate')}`, 'Donate button has correct text');
    });

    test('desktop layout (logged out)', async function(assert) {
        setBreakpoint('desktop');
        this.owner.lookup('service:session').set('isAuthenticated', false);

        await render(hbs`<RegistriesNavbar @campaign="osf-registries" />`);

        assert.dom('a[data-test-join]').hasText(`${t('navbar.join')}`);
        assert.dom('a[data-test-join]').hasAttribute(
            'href',
            `/register?campaign=osf-registries&next=${osfUrl}FakeURL`,
        );
        assert.dom('a[data-test-join]').isVisible('Join button is visible');

        assert.dom('a[role="button"][data-test-login]').hasText(`${t('navbar.login')}`);
        assert.dom('a[role="button"][data-test-login]').isVisible('Login button is visible');

        assert.dom('img[data-test-gravatar]').isNotVisible('No user Gravatar when logged out');
    });

    test('desktop layout (logged in)', async function(assert) {
        setBreakpoint('desktop');
        this.owner.lookup('service:session').set('isAuthenticated', true);

        await render(hbs`<RegistriesNavbar />`);

        // Not visible due to not having a test image
        assert.dom('img[data-test-gravatar]').exists('User Gravatar is rendered');
        assert.dom('img[data-test-gravatar]').hasAttribute('src', 'example.png?&s=30');
        assert.dom('img[data-test-gravatar]').hasAttribute('alt', `${t('auth_dropdown.user_gravatar')}`);

        assert.dom('a[role="button"][data-test-join]').isNotVisible('Join button not is visible');
        assert.dom('a[role="button"][data-test-login]').isNotVisible('Login button not is visible');
    });

    test('tablet layout', async assert => {
        setBreakpoint('tablet');

        await render(hbs`<RegistriesNavbar />`);

        assert.equal(visibleText('[data-test-service]'), `${t('general.OSF')}${t('general.services.registries')}`);
        assert.dom('[data-test-search-bar]').isVisible('Search bar is visible');
        assert.dom('[data-test-search-bar-mobile]').isNotVisible('Mobile search bar is not visible on tablet');

        assert.dom('a[data-test-help]').isVisible('Help button is visible');
        assert.dom('a[data-test-help]').hasText(`${t('general.help')}`, 'Help button has correct text');

        assert.dom('a[data-test-donate]').isVisible('Donate button is visible');
        assert.dom('a[data-test-donate]').hasText(`${t('navbar.donate')}`, 'Donate button has correct text');
    });

    test('tablet layout (logged out)', async function(assert) {
        setBreakpoint('tablet');
        this.owner.lookup('service:session').set('isAuthenticated', false);

        await render(hbs`<RegistriesNavbar />`);

        assert.dom('a[data-test-join]').hasText(`${t('navbar.join')}`);
        assert.dom('a[data-test-join]').isVisible('Join button is visible');

        assert.dom('a[role="button"][data-test-login]').hasText(`${t('navbar.login')}`);
        assert.dom('a[role="button"][data-test-login]').isVisible('Login button is visible');

        assert.dom('img[data-test-gravatar]').isNotVisible('No user Gravatar when logged out');
    });

    test('tablet layout (logged in)', async function(assert) {
        setBreakpoint('tablet');
        this.owner.lookup('service:session').set('isAuthenticated', true);

        await render(hbs`<RegistriesNavbar />`);

        // Not visible due to not having a test image
        assert.dom('img[data-test-gravatar]').exists('User Gravatar is rendered');

        assert.dom('a[role="button"][data-test-join]').isNotVisible('Join button not is visible');
        assert.dom('a[role="button"][data-test-login]').isNotVisible('Login button not is visible');
    });

    test('mobile layout', async function(assert) {
        setBreakpoint('mobile');
        this.owner.lookup('service:session').set('isAuthenticated', true);

        await render(hbs`<RegistriesNavbar />`);

        await click('[data-test-gravatar]');

        assert.equal(visibleText('[data-test-service]'), `${t('general.OSF')}${t('general.services.registries')}`);
        assert.dom('[data-test-search-bar-mobile]').isVisible('Mobile search bar visible');

        assert.dom('a[data-test-help-mobile]').isVisible();
        assert.dom('a[data-test-donate-mobile]').isVisible();
        assert.dom('[data-test-search-bar]').isNotVisible('Search bar hidden');
    });

    test('mobile layout (logged out)', async function(assert) {
        setBreakpoint('mobile');
        this.owner.lookup('service:session').set('isAuthenticated', false);

        await render(hbs`<RegistriesNavbar />`);

        await click('[data-test-toggle-navbar]');

        assert.dom('a[data-test-join-mobile]').hasText(`${t('navbar.join')}`);
        assert.dom('a[data-test-join-mobile]').isVisible('Join button is visible');

        assert.dom('button[data-test-login-mobile]').hasText(`${t('navbar.login')}`);
        assert.dom('button[data-test-login-mobile]').isVisible('Login button is visible');

        assert.dom('img[data-test-gravatar]').isNotVisible('No user Gravatar when logged out');
    });

    test('mobile layout (logged in)', async function(assert) {
        setBreakpoint('mobile');

        this.owner.lookup('service:session').set('isAuthenticated', true);

        await render(hbs`<RegistriesNavbar />`);

        // Not visible due to not having a test image
        assert.dom('img[data-test-gravatar]').exists('User Gravatar is rendered');

        assert.dom('a[role="button"][data-test-join]').isNotVisible('Join button not is visible');
        assert.dom('a[role="button"][data-test-login]').isNotVisible('Login button not is visible');
    });

    test('onSearch', async function(assert) {
        setBreakpoint('desktop');

        this.set('onSearch', sinon.stub());

        await render(hbs`<RegistriesNavbar @onSearch={{this.onSearch}} />`);

        await fillIn('[data-test-search-bar] input', 'This is my query');
        await triggerKeyEvent('[data-test-search-bar] input', 'keyup', 13);

        assert.ok(this.get('onSearch').calledWith('This is my query'));
    });

    test('onSearch (Mobile)', async function(assert) {
        setBreakpoint('mobile');

        this.set('onSearch', sinon.stub());

        await render(hbs`<RegistriesNavbar @onSearch={{this.onSearch}} />`);

        assert.dom('[data-test-search-bar-mobile]').isVisible();

        await fillIn('[data-test-search-bar-mobile] input', 'This is my query');
        await triggerKeyEvent('[data-test-search-bar-mobile] input', 'keyup', 13);

        assert.ok(this.get('onSearch').calledWith('This is my query'));
    });

    test('service list', async assert => {
        await render(hbs`<RegistriesNavbar />`);

        assert.dom('[data-test-service-list]').isNotVisible();

        await click('[data-test-service]');

        assert.dom('[data-test-service-list]').isVisible();
    });

    test('auth dropdown', async function(assert) {
        this.owner.lookup('service:session').set('isAuthenticated', true);

        await render(hbs`<RegistriesNavbar />`);

        assert.dom('[data-test-auth-dropdown]').isNotVisible();

        await click('[data-test-gravatar]');

        assert.dom('[data-test-auth-dropdown]').isVisible();
    });
});
