import Service from '@ember/service';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import config from 'ember-get-config';
import { setupIntl, t } from 'ember-intl/test-support';
import { percySnapshot } from 'ember-percy';
import { setBreakpoint } from 'ember-responsive/test-support';
import { TestContext } from 'ember-test-helpers';
import $ from 'jquery';
import { module, test } from 'qunit';
import sinon from 'sinon';

import { setupEngineRenderingTest } from 'ember-osf-web/tests/helpers/engines';

const { OSF: { url: osfUrl } } = config;

const statusMessagesStub = Service.extend({
    messages: [],

    getCookieMessages() {
        return [];
    },
});

const analyticsStub = Service.extend({
    // eslint-disable-next-line ember/no-actions-hash
    actions: {
        // eslint-disable-next-line no-empty,@typescript-eslint/no-empty-function
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

const osfRouterStub = Service.extend({
    transitionTo: () => null,
});

const headTagsStub = Service.extend({
    collectHeadTags: () => { /* noop */ },
});

function visibleText(selector: string) {
    // https://stackoverflow.com/questions/1846177/how-do-i-get-just-the-visible-text-with-jquery-or-javascript
    return $(`${selector} *:not(:has(*)):visible`).text().replace(/\s+/g, ' ').trim();
}

module('Registries | Integration | Component | registries-navbar', hooks => {
    setupEngineRenderingTest(hooks, 'registries');
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.owner.register('service:head-tags', headTagsStub);
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
        this.owner.register('service:osfRouter', osfRouterStub);
    });

    test('it renders', async assert => {
        await render(hbs`<RegistriesNavbar />`);

        assert.dom('nav[data-test-nav]').exists('The nav element is rendered');
    });

    test('desktop layout', async assert => {
        setBreakpoint('desktop');

        await render(hbs`<RegistriesNavbar />`);
        await percySnapshot(assert);

        // Don't show provider name unless provider is branded
        assert.dom('[data-test-brand-link]').doesNotExist('Branded provider name does not exists');

        assert.equal(visibleText('[data-test-service]'), `${t('general.OSF')}${t('general.services.registries')}`);
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
        await percySnapshot(assert);

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
        await percySnapshot(assert);

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
        await percySnapshot(assert);

        assert.dom('[data-test-service]').doesNotContainText(
            `${t('general.OSF')}${t('general.services.registries')}`, 'Navbar text hidden on tablet view',
        );
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
        await percySnapshot(assert);

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
        await percySnapshot(assert);

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
        await percySnapshot(assert);

        assert.dom('a[data-test-help-mobile]').isVisible();
        assert.dom('a[data-test-donate-mobile]').isVisible();
    });

    test('mobile layout (logged out)', async function(assert) {
        setBreakpoint('mobile');
        this.owner.lookup('service:session').set('isAuthenticated', false);

        await render(hbs`<RegistriesNavbar />`);

        await click('[data-test-toggle-navbar]');
        await percySnapshot(assert);

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
        await percySnapshot(assert);

        // Not visible due to not having a test image
        assert.dom('img[data-test-gravatar]').exists('User Gravatar is rendered');

        assert.dom('a[role="button"][data-test-join]').isNotVisible('Join button not is visible');
        assert.dom('a[role="button"][data-test-login]').isNotVisible('Login button not is visible');
    });

    test('service list', async assert => {
        await render(hbs`<RegistriesNavbar />`);

        assert.dom('[data-test-service-list] ul').isNotVisible();

        await click('[data-test-service]');
        await percySnapshot(assert);

        assert.dom('[data-test-service-list] ul').isVisible();
    });

    test('auth dropdown', async function(assert) {
        this.owner.lookup('service:session').set('isAuthenticated', true);

        await render(hbs`<RegistriesNavbar />`);

        assert.dom('[data-test-auth-dropdown] ul').isNotVisible();

        await click('[data-test-gravatar]');
        await percySnapshot(assert);

        assert.dom('[data-test-auth-dropdown] ul').isVisible();
    });

    test('branded desktop layout', async function(assert) {
        const brand = server.create('brand');
        const brandedProvider = server.create('registration-provider', { name: 'ISPOR', brand });

        this.set('provider', brandedProvider);
        setBreakpoint('desktop');

        await render(hbs`<RegistriesNavbar @provider={{this.provider}} />`);
        await percySnapshot(assert);

        assert.dom('[data-test-brand-link]').exists('Branded provider name exists');
        assert.dom('[data-test-brand-link]').hasText(brandedProvider.name, 'Branded provider name is correct');
    });

    test('branded name does not show up on mobile layout', async function(assert) {
        const brand = server.create('brand');
        const brandedProvider = server.create('registration-provider', { name: 'ISPOR', brand });

        this.set('provider', brandedProvider);
        setBreakpoint('mobile');

        await render(hbs`<RegistriesNavbar @provider={{this.provider}} />`);
        await percySnapshot(assert);

        assert.dom('[data-test-brand-link]').doesNotExist('Branded provider name does not exists');
    });
});

