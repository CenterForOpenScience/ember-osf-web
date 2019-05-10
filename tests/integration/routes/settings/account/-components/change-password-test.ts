import { fillIn, render, settled } from '@ember/test-helpers';
import { percySnapshot } from 'ember-percy';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { click } from 'ember-osf-web/tests/helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | routes | settings | account | -components | change-password', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async assert => {
        await render(hbs`{{settings/account/-components/change-password}}`);

        assert.dom('[data-test-change-password-panel]').exists('Password section renders');
        assert.dom('[data-test-password-form]').exists('Password form renders');
        await percySnapshot(assert);
    });

    // Validation works
    test('validation works', async assert => {
        await render(hbs`{{settings/account/-components/change-password}}`);

        const oldPassword = 'oldPassword1234';
        const newPassword = 'newPassword1234';
        const confirmPassword = 'newPassword123410abcd';

        assert.dom('[data-test-change-password-panel]').exists('Password section renders');
        assert.dom('[data-test-password-form]').exists('Password form renders');

        await click('[data-test-update-password-button]');
        await percySnapshot(assert);

        // Check that validations are for empty fields
        settled().then(() => {
            assert.dom('[data-test-current-password] div[class*="help-block"]')
                .exists('Validation works for old password');
            assert.dom('[data-test-new-password] div[class*="help-block"]').exists('Validation works for new password');
            assert.dom('[data-test-confirm-password] div[class*="help-block"]')
                .exists('Validation works for confirm password');
        });

        await fillIn('[data-test-current-password] input', oldPassword);
        await fillIn('[data-test-new-password] input', oldPassword);
        await fillIn('[data-test-confirm-password] input', confirmPassword);

        // Check:
        // 1.) Old password no longer has a validation message
        // 2.) New password has a validation error for matching old password
        // 3.) Confirm password has a validation error for not matching new password
        settled().then(() => {
            assert.dom('[data-test-current-password] div[class*="help-block"]')
                .doesNotExist('No error validations on old password');
            assert.dom('[data-test-new-password] div[class*="help-block"]')
                .matchesText('Your new password cannot be the same as your old password.');
            assert.dom('[data-test-confirm-password] div[class*="help-block"]').matchesText('Passwords must match.');
        });

        await fillIn('[data-test-new-password] input', newPassword);

        // Check:
        // 1.) New password no longer has validation error for matching old password
        // 2.) Confirm password still has a validation error for not matching new password
        settled().then(() => {
            assert.dom('[data-test-new-password] div[class*="help-block"]')
                .doesNotExist('No error validations on new password');
            assert.dom('[data-test-confirm-password] div[class*="help-block"]').matchesText('Passwords must match.');
        });

        await fillIn('[data-test-confirm-password] input', newPassword);

        // Check:
        // 1.) Confirm password no longer has validation error
        settled().then(() => {
            assert.dom('[data-test-new-password] div[class*="help-block"]')
                .doesNotExist('No error validations on current password');
        });
    });

    // Check validation double message for new password
    test('double validation messages do not appear', async assert => {
        await render(hbs`{{settings/account/-components/change-password}}`);

        await click('[data-test-update-password-button]');

        settled().then(() => {
            assert.dom('[data-test-new-password] div[class*="help-block"]').matchesText("This field can't be blank.");
        });

        await fillIn('[data-test-new-password] input', 'abcabcab');

        settled().then(() => {
            // Check to make sure that when both the validation and password suggestion would return an string,
            // only one is shown
            assert.dom('[data-test-new-password] div[class*="help-block"]')
                .matchesText('Repeats like "abcabcabc" are only slightly harder to guess than "abc"');
            assert.dom('[data-test-new-password] div[class*="help-block"]').exists({ count: 1 });
        });
    });
});
