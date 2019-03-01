import { fillIn, visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

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
    assert.dom('[data-test-verification-code-field] .help-block')
        .doesNotExist(`${testState} - No error from security panel`);
}

module('Acceptance | settings', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('two factor does not validate or submit when user disabling is requested', async assert => {
        assert.expect(24);
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
        await fillIn('[data-test-verification-code-field] input', 'a');
        await click('[data-analytics-name="Deactivation request"]');
        await click('[data-test-confirm-deactivation-submit]');
        assertionsEnabledNotConfirmed(assert, 'After deactivation');
        await click('[data-test-verify-button]');
        assert.dom('[data-test-verification-code-field] .help-block')
            .containsText('This field must be a number.');
    });
});
