import { run } from '@ember/runloop';
import { click, render } from '@ember/test-helpers';
import { make, mockFindRecord, setupFactoryGuy } from 'ember-data-factory-guy';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, skip, test } from 'qunit';

module('Integration | Component | tos-consent-banner', hooks => {
    setupRenderingTest(hooks);
    setupFactoryGuy(hooks);

    test('hidden when no user is logged in', async function(assert) {
        await render(hbs`{{tos-consent-banner}}`);
        assert.notHasText(this.element);
    });

    skip('shown when current user has not accepted ToS', async function(assert) {
        await run(async () => {
            const session = this.owner.lookup('service:session');
            session.set('isAuthenticated', true);
            session.set('data', { authenticated: { id: '1' } });
            const user = make('user', { id: '1', acceptedTermsOfService: null });
            mockFindRecord('user').returns({ model: user });
            await render(hbs`{{tos-consent-banner}}`);
            assert.includesText(
                this.element,
                'We\'ve updated our Terms of Use and Privacy Policy. Please read them carefully.',
                'Displays expected text.',
            );
            assert.notIncludesText(
                this.element,
                'You must read and agree to the Terms of Use and Privacy Policy.',
                'Does not display validation error message.',
            );
            await click('[class*="TosConsentBanner"] button[type="submit"]');
            assert.includesText(
                this.element,
                'You must read and agree to the Terms of Use and Privacy Policy.',
                'Displays validation error message after clicking continue.',
            );
        });
    });

    test('hidden when current user has accepted ToS', async function(assert) {
        await run(async () => {
            const session = this.owner.lookup('service:session');
            session.set('isAuthenticated', true);
            session.set('data', { authenticated: { id: '1' } });
            const user = make('user', { id: '1', acceptedTermsOfService: true });
            mockFindRecord('user').returns({ model: user });
            await render(hbs`{{tos-consent-banner}}`);
            assert.notHasText(this.element);
        });
    });
});
