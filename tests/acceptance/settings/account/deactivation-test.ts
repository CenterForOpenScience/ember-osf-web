import { visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

function assertDeactivationNotRequested(assert: Assert, testState: string) {
    // 5 assertions
    assert.dom('[data-test-deactivation-panel]').exists(testState);
    assert.dom('[data-test-confirm-deactivation-submit]').doesNotExist(testState);
    assert.dom('[data-test-confirm-undo-deactivation-submit]').doesNotExist(testState);
    assert.dom('[data-analytics-name="Deactivation request"]').exists(testState);
    assert.dom('[data-analytics-name="Undo deactivation request"]')
        .doesNotExist(testState);
}

function assertDeactivationRequested(assert: Assert, testState: string) {
    // 5 assertions
    assert.dom('[data-test-deactivation-panel]').exists(testState);
    assert.dom('[data-test-confirm-deactivation-submit]').doesNotExist(testState);
    assert.dom('[data-test-confirm-undo-deactivation-submit]').doesNotExist(testState);
    assert.dom('[data-analytics-name="Deactivation request"]').doesNotExist(testState);
    assert.dom('[data-analytics-name="Undo deactivation request"]')
        .exists(testState);
}

module('Acceptance | settings/account | deactivation', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('it works from default state', async assert => {
        assert.expect(32);
        const currentUser = server.create('user', 'loggedIn');
        server.create('user-setting', { user: currentUser });
        await visit('/settings/account');
        assertDeactivationNotRequested(assert, 'Initial state');
        await click('[data-analytics-name="Deactivation request"]');
        assert.dom('[data-test-confirm-deactivation-submit]').exists('First attempt');
        percySnapshot('Acceptance | settings/account | deactivation | Deactivation dialog');
        assert.dom('[data-test-deactivation-cancel]')
            .exists('Cancelling deactivation confirmation');
        await click('[data-test-deactivation-cancel]');
        assertDeactivationNotRequested(assert, 'Deactivation cancelled');
        await click('[data-analytics-name="Deactivation request"]');
        assert.dom('[data-test-confirm-deactivation-submit]').exists('Second attempt');
        await click('[data-test-confirm-deactivation-submit]');
        assertDeactivationRequested(assert, 'Deactivation confirmed');
        await click('[data-analytics-name="Undo deactivation request"]');
        assert.dom('[data-test-undo-warning-cancel]').exists('Undo deactivation cancellation');
        percySnapshot('Acceptance | settings/account | deactivation | Undo deactivation dialog');
        await click('[data-test-undo-warning-cancel]');
        assertDeactivationRequested(assert, 'Undo deactivation cancelled');
        assert.dom('[data-analytics-name="Undo deactivation request"]').exists();
        await click('[data-analytics-name="Undo deactivation request"]');
        assert.dom('[data-test-undo-warning-confirm]').exists('Deactivation confirmation');
        await click('[data-test-undo-warning-confirm]');
        assertDeactivationNotRequested(assert, 'Deactivation undone');
    });

    test('it works from deactivation requested state', async assert => {
        assert.expect(6);
        const currentUser = server.create('user', 'loggedIn');
        server.create('user-setting', {
            user: currentUser,
            deactivationRequested: true,
        });
        await visit('/settings/account');
        assertDeactivationRequested(assert, 'From page reload');
    });
});
