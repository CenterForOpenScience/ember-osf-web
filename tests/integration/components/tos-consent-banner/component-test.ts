import Service from '@ember/service';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';
import sinon from 'sinon';

import CurrentUser from 'ember-osf-web/services/current-user';
import { click } from 'ember-osf-web/tests/helpers';

interface ThisTestContext extends TestContext {
    currentUser: CurrentUser;
}

const sessionStub = Service.extend({
    isAuthenticated: false,
    data: {},
    on: () => { /* stub */ },
});

module('Integration | Component | tos-consent-banner', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    const sandbox = sinon.createSandbox();

    hooks.beforeEach(function(this: ThisTestContext) {
        this.store = this.owner.lookup('service:store');
        this.currentUser = this.owner.lookup('service:current-user');
        this.owner.unregister('service:session');
        this.owner.register('service:session', sessionStub);

    });

    hooks.afterEach(() => {
        sandbox.restore();
    });

    test('hidden when no user is logged in', async function(assert) {
        await render(hbs`<TosConsentBanner />`);
        assert.dom(this.element).hasText('');
    });

    test('shown when current user has not accepted ToS', async function(this: ThisTestContext, assert) {
        const session = this.owner.lookup('service:session');
        session.set('isAuthenticated', true);
        session.set('data', { authenticated: { id: '1' } });

        const mirageUser = server.create('user', { id: '1', acceptedTermsOfService: undefined }, 'loggedIn');
        const user = await this.store.findRecord('user', mirageUser.id);

        sandbox.stub(this.currentUser, 'user').get(() => user);

        await render(hbs`<TosConsentBanner />`);
        assert.dom(this.element)
            .includesText(
                'We\'ve updated our Terms of Use and Privacy Policy. Please read them carefully.',
                'Displays expected text.',
            );
        assert.dom(this.element)
            .doesNotIncludeText(
                'You must read and agree to the Terms of Use and Privacy Policy.',
                'Does not display validation error message.',
            );
        await click('[data-test-tos-consent-alert-submit-button]');
        assert.dom(this.element)
            .includesText(
                'You must read and agree to the Terms of Use and Privacy Policy.',
                'Displays validation error message after clicking continue.',
            );
    });

    test('hidden when current user has accepted ToS', async function(this: ThisTestContext, assert) {
        const session = this.owner.lookup('service:session');

        session.set('isAuthenticated', true);
        session.set('data', { authenticated: { id: '1' } });

        const mirageUser = server.create('user', { id: '1', acceptedTermsOfService: true }, 'loggedIn');
        const user = await this.store.findRecord('user', mirageUser.id);

        sandbox.stub(this.currentUser, 'user').get(() => user);

        await render(hbs`<TosConsentBanner />`);
        assert.dom(this.element).hasText('');
    });
});
