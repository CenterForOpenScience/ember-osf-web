import { run } from '@ember/runloop';
import { render } from '@ember/test-helpers';
import { make, mockFindRecord, setupFactoryGuy } from 'ember-data-factory-guy';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | tos-consent-banner', hooks => {
    setupRenderingTest(hooks);
    setupFactoryGuy(hooks);

    test('hidden when no user is logged in', async function(assert) {
        await render(hbs`{{tos-consent-banner}}`);
        assert.equal(this.$().text().trim(), '');
    });

    test('shown when current user has not accepted ToS', async function(assert) {
        await run(async () => {
            const session = this.owner.lookup('service:session');
            session.set('isAuthenticated', true);
            session.set('data', { authenticated: { id: '1' } });
            const user = make('user', { id: '1', fullName: 'test', acceptedTermsOfService: false });
            mockFindRecord('user').returns({ model: user });
            await render(hbs`{{tos-consent-banner}}`);
            assert.ok(this.$().text().trim().includes(
                'We\'ve updated our Terms of Use and Privacy Policy. Please read them carefully.',
            ));
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
            assert.equal(this.$().text().trim(), '');
        });
    });
});
