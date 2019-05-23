import { render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { t } from 'ember-i18n/test-support';
import { percySnapshot } from 'ember-percy';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import { click } from 'ember-osf-web/tests/helpers';

module('Integration | routes | settings | account | -components | connected-identities', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    test('no connected identities', async assert => {
        await render(hbs`{{settings/account/-components/connected-identities}}`);

        assert.dom('[data-test-connected-identities-panel]')
            .exists('Connected identities section renders');
        assert.dom('[data-test-connected-identities-panel] [data-test-panel-heading]')
            .hasText(
                t('settings.account.connected_identities.title').toString(),
                'title is correct',
            );
        assert.dom('[data-test-connected-identities-description]')
            .hasText(
                t('settings.account.connected_identities.description').toString().replace(/(<([^>]+)>)/ig, ''),
                'description is correct',
            );
        assert.dom('[data-test-connected-identities-item').doesNotExist(
            'no identities in the list',
        );
        assert.dom('[data-test-connected-identities-list]')
            .hasText(
                t('settings.account.connected_identities.no_identities').toString(),
                'list displays text for no identities',
            );
        await percySnapshot(assert);
    });

    test('identity statuses', async assert => {
        const identity1 = server.create('external-identity', 'withStatusVerified');
        const identity2 = server.create('external-identity', 'withStatusCreate');
        const identity3 = server.create('external-identity', 'withStatusLink');

        await render(hbs`{{settings/account/-components/connected-identities}}`);

        const verified = t('settings.account.connected_identities.status.verified');
        assert.dom(`[data-test-connected-identities-item=${identity1.id}]`).exists(
            { count: 1 },
            'identity1 is in the list',
        );
        assert.dom(`[data-test-connected-identities-item=${identity1.id}]`)
            .hasText(
                `${identity1.id}: ${identity1.externalId} ( ${verified} )`,
                'list displays expected text for identity with status: VERIFIED',
            );

        const pending = t('settings.account.connected_identities.status.pending');
        assert.dom(`[data-test-connected-identities-item=${identity2.id}]`).exists(
            { count: 1 },
            'identity2 is in the list',
        );
        assert.dom(`[data-test-connected-identities-item=${identity2.id}]`)
            .hasText(
                `${identity2.id}: ${identity2.externalId} ( ${pending} )`,
                'list displays expected text for identity with status: CREATE',
            );
        assert.dom(`[data-test-connected-identities-item=${identity3.id}]`).exists(
            { count: 1 },
            'identity3 is in the list',
        );
        assert.dom(`[data-test-connected-identities-item=${identity3.id}]`)
            .hasText(
                `${identity3.id}: ${identity3.externalId} ( ${pending} )`,
                'list displays expected text for identity with status: LINK',
            );

        await percySnapshot(assert);
    });

    test('pagination', async assert => {
        server.createList('external-identity', 12);

        await render(hbs`{{settings/account/-components/connected-identities}}`);

        assert.dom('[data-test-connected-identities-item]').exists(
            { count: 10 },
            'ten identities on the first page',
        );
        await percySnapshot(assert);

        await click('[data-test-next-page-button]');
        assert.dom('[data-test-connected-identities-item]').exists(
            { count: 2 },
            'two identites on the second page',
        );
        await percySnapshot(assert);
    });

    test('remove identity', async assert => {
        const identities = server.createList('external-identity', 12);
        const identity = identities[2];

        await render(hbs`{{settings/account/-components/connected-identities}}`);

        assert.dom(`[data-test-connected-identities-item=${identity.id}]`).exists(
            { count: 1 },
            'expected identity is in the list',
        );
        await click(`[data-test-connected-identities-item=${identity.id}] [data-test-delete-button]`);
        await percySnapshot(assert);
        await click('[data-test-cancel-delete]');
        assert.dom(`[data-test-connected-identities-item=${identity.id}]`).exists(
            { count: 1 },
            'expected identity is still in the list',
        );

        await click(`[data-test-connected-identities-item=${identity.id}] [data-test-delete-button]`);
        await click('[data-test-confirm-delete]');
        assert.dom(`[data-test-connected-identities-item=${identity.id}]`).doesNotExist(
            'removed identity is no longer in the list',
        );
    });

    test('remove last identity', async assert => {
        const identity = server.create('external-identity');

        await render(hbs`{{settings/account/-components/connected-identities}}`);

        assert.dom(`[data-test-connected-identities-item=${identity.id}]`).exists(
            { count: 1 },
            'expected identity is in the list',
        );
        await click(`[data-test-connected-identities-item=${identity.id}] [data-test-delete-button]`);
        await click('[data-test-confirm-delete]');
        assert.dom(`[data-test-connected-identities-item=${identity.id}]`).doesNotExist(
            'removed identity is no longer in the list',
        );
        assert.dom('[data-test-connected-identities-list]')
            .hasText(
                t('settings.account.connected_identities.no_identities').toString(),
                'list displays text for no identities',
            );
    });
});
