import { currentURL, fillIn, visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';
import { CurrentUserStub } from 'ember-osf-web/tests/helpers/require-auth';

function assertionsNotEnabledNotConfirmed(assert: Assert, testState: string) {
    // 12 assertions
    assert.dom('[data-test-security-panel]')
        .exists(`${testState} - Security panel exists`);
    assert.dom('[data-test-two-factor-enable-button]')
        .exists(`${testState} - Enable button exists`);
    assert.dom('[data-test-two-factor-disable-button]')
        .doesNotExist(`${testState} - Disable button does not exist`);
    assert.dom('[data-test-two-factor-verify-cancel-button]')
        .doesNotExist(`${testState} - No cancel button from verification step`);
    assert.dom('[data-test-why-two-factor]')
        .includesText('By using two-factor authentication', `${testState} - Two factor text correct`);
    assert.dom('[data-test-2f-important-warning]')
        .doesNotExist(`${testState} - Two factor warning isn't showing`);
    assert.dom('[data-test-2f-how-to]')
        .doesNotExist(`${testState} - Two factor how-to isn't showing`);
    assert.dom('[data-test-2f-once-verified]')
        .doesNotExist(`${testState} - Two factor once verified isn't showing`);
    assert.dom('[data-test-2f-scan-image]')
        .doesNotExist(`${testState} - Scan image instructions aren't showing`);
    assert.dom('[data-test-2f-qr-code]')
        .doesNotExist(`${testState} - QR code isn't showing`);
    assert.dom('[data-test-verification-code-field]')
        .doesNotExist(`${testState} - Form field isn't showing`);
    assert.dom('[data-test-verify-button]')
        .doesNotExist(`${testState} - Verify button isn't showing`);
}

function assertionsEnabledNotConfirmed(assert: Assert, testState: string) {
    // 10 assertions
    assert.dom('[data-test-security-panel]')
        .exists(`${testState} - Security panel exists`);
    assert.dom('[data-test-two-factor-enable-button]')
        .doesNotExist(`${testState} - Two factor enable button not shown`);
    assert.dom('[data-test-two-factor-verify-cancel-button]')
        .exists(`${testState} - Two factor disable button shown`);
    assert.dom('[data-test-why-two-factor]')
        .includesText('By using two-factor authentication', `${testState} - Why two factor text exists`);
    assert.dom('[data-test-2f-important-warning]')
        .includesText('If you lose access to your mobile', `${testState} - Important warning shown`);
    assert.dom('[data-test-2f-once-verified]')
        .exists(`${testState} - Once verified instructions shown`);
    assert.dom('[data-test-2f-scan-image]')
        .includesText('S3CR3TSHH', `${testState} - Secret from the API is embedded in instructions`);
    assert.dom('[data-test-2f-qr-code]')
        .exists(`${testState} - QR code is visible`);
    assert.dom('[data-test-verification-code-field]')
        .exists(`${testState} - Verification field exists`);
    assert.dom('[data-test-verify-button]')
        .exists(`${testState} - Verify button is shown`);
}

function assertionsEnabledConfirmed(assert: Assert, testState: string) {
    // 10 assertions
    assert.dom('[data-test-two-factor-enable-button]')
        .doesNotExist(`${testState} - `);
    assert.dom('[data-test-two-factor-disable-button]')
        .exists(`${testState} - `);
    assert.dom('[data-test-2f-important-warning]')
        .doesNotExist(`${testState} - `);
    assert.dom('[data-test-2f-how-to]')
        .doesNotExist(`${testState} - `);
    assert.dom('[data-test-2f-once-verified]')
        .doesNotExist(`${testState} - `);
    assert.dom('[data-test-2f-scan-image]')
        .doesNotExist(`${testState} - `);
    assert.dom('[data-test-2f-qr-code]')
        .doesNotExist(`${testState} - `);
    assert.dom('[data-test-verification-code-field]')
        .doesNotExist(`${testState} - `);
    assert.dom('[data-test-verify-button]')
        .doesNotExist(`${testState} - `);
    assert.dom('[data-test-2f-important-warning]')
        .doesNotExist(`${testState} - `);
}

module('Acceptance | settings/account | security', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('cannot use unauthenticated', async function(assert) {
        this.owner.register('service:current-user', CurrentUserStub);
        const currentUser = this.owner.lookup('service:current-user');
        await visit('/settings/account/');
        assert.equal(currentUser.urlCalled, '/settings/account');
    });

    test('two factor disabled shows properly', async assert => {
        assert.expect(13);
        const currentUser = server.create('user', 'loggedIn');
        server.create(
            'user-setting',
            {
                user: currentUser,
                twoFactorEnabled: false,
                twoFactorConfirmed: false,
            },
        );
        await visit('/settings/account');
        assertionsNotEnabledNotConfirmed(assert, 'InitialState');
        await percySnapshot(assert);
    });

    test('two factor enabled unconfirmed shows and disables properly', async assert => {
        assert.expect(23);
        const currentUser = server.create('user', 'loggedIn');
        server.create(
            'user-setting',
            {
                user: currentUser,
                twoFactorEnabled: true,
                twoFactorConfirmed: false,
            },
        );
        await visit('/settings/account');
        assertionsEnabledNotConfirmed(assert, 'Initital state');
        await percySnapshot(assert);
        await click('[data-test-two-factor-verify-cancel-button]');
        assertionsNotEnabledNotConfirmed(assert, 'After disabling two-factor');
    });

    test('two factor verification works and disables', async assert => {
        const currentUser = server.create('user', 'loggedIn');
        server.create(
            'user-setting',
            {
                user: currentUser,
                twoFactorEnabled: true,
                twoFactorConfirmed: false,
            },
        );
        await visit('/settings/account');
        assertionsEnabledNotConfirmed(assert, 'Initial state');
        await click('[data-test-verify-button]');
        assert.dom('[data-test-verification-code-field] .help-block')
            .containsText('This field can\'t be blank');
        await fillIn('[data-test-verification-code-field] input', 'a');
        assert.dom('[data-test-verification-code-field] .help-block')
            .containsText('This field must be a number.');

        /* I don't think I can test this properly right now. Ember qunit has a problem with waiting
        so long for catching the assertion.
        https://github.com/emberjs/ember-qunit/issues/256
        https://discuss.emberjs.com/t/how-to-catch-errors-in-component-rendering-test/14854/3
        https://github.com/emberjs/ember-test-helpers/issues/310

            await fillIn('[data-test-verification-code-field] input', '111');
            assert.dom('[data-test-verification-code-field] .help-block')
                .doesNotExist('Model validation correct');
            assert.dom('[data-test-verification-error]').doesNotExist();
            await click('[data-test-verify-button]');
            assert.dom('[data-test-verification-error]').exists();
        */

        await fillIn('[data-test-verification-code-field] input', '123456');
        await click('[data-test-verify-button]');
        assertionsEnabledConfirmed(assert, 'After successful verification');
        await percySnapshot(assert);
    });

    test('two factor disabled->confirmed round trip works', async assert => {
        assert.expect(46);
        const currentUser = server.create('user', 'loggedIn');
        server.create(
            'user-setting',
            {
                user: currentUser,
                twoFactorEnabled: false,
                twoFactorConfirmed: false,
            },
        );
        await visit('/settings/account');

        assert.equal(currentURL(), '/settings/account');
        assertionsNotEnabledNotConfirmed(assert, 'Initial state');
        await click('[data-test-two-factor-enable-button]');
        await percySnapshot('Acceptance | settings/account | security | Enable warning dialog');
        await click('[data-test-enable-warning-confirm]');
        assertionsEnabledNotConfirmed(assert, 'After enabling before verifying');
        await fillIn('[data-test-verification-code-field] input', '123456');
        await click('[data-test-verify-button]');
        assertionsEnabledConfirmed(assert, 'After successfully verifying');
        await click('[data-test-two-factor-disable-button]');
        await percySnapshot('Acceptance | settings/account | security | Disable warning dialog');
        await click('[data-test-disable-warning-confirm]');
        assertionsNotEnabledNotConfirmed(assert, 'After disabling');
    });
});
