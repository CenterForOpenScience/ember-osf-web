import { currentRouteName, resetOnerror, setupOnerror } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { selectChoose } from 'ember-power-select/test-support';
import { module, test } from 'qunit';

import { click, currentURL, setupOSFApplicationTest, visit } from 'ember-osf-web/tests/helpers';
import { TestContext } from 'ember-test-helpers';
import { Permission } from 'ember-osf-web/models/osf-model';
import fillIn from '@ember/test-helpers/dom/fill-in';

import { languageFromLanguageCode } from 'osf-components/components/file-metadata-manager/component';

module('Acceptance | guid-node/metadata', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('logged out', async function(this: TestContext, assert) {
        const node = server.create('node', {
            id: 'mtadt',
            currentUserPermissions: [],
        });
        const url = `/${node.id}/metadata`;

        await visit(url);
        const metadataRecord = await this.owner.lookup('service:store')
            .findRecord('custom-item-metadata-record', node.id);
        assert.equal(currentURL(), url, `We are on ${url}`);
        assert.equal(currentRouteName(), 'guid-node.metadata', 'We are at guid-node.metadata');
        assert.dom('[data-test-display-resource-language]')
            .containsText(languageFromLanguageCode(metadataRecord.language), 'Language is correct');
        assert.dom('[data-test-display-resource-type-general]')
            .containsText(metadataRecord.resourceTypeGeneral, 'Resource type is correct');
        assert.dom('[data-test-display-node-description]')
            .containsText(node.description, 'Description is correct');
        for (const funder of metadataRecord.funders) {
            assert.dom(`[data-test-display-funder-name="${funder.funder_name}"]`)
                .containsText(funder.funder_name, `Funder name is correct for ${funder.funder_name}`);
            assert.dom(`[data-test-display-funder-award-title="${funder.funder_name}"]`)
                .containsText(funder.award_title, `Funder award title is correct for ${funder.funder_name}`);
            assert.dom(`[data-test-display-funder-award-uri="${funder.funder_name}"]`)
                .containsText(funder.award_uri,  `Funder award URI is correct for ${funder.funder_name}`);
            assert.dom(`[data-test-display-funder-award-number="${funder.funder_name}"`)
                .containsText(funder.award_number,  `Funder award number is correct for ${funder.funder_name}`);
        }
        assert.dom('[data-test-contributors-list]').exists();
        assert.dom('[data-test-subjects-list]').doesNotExist('There are no subjects for projects');

        assert.dom('[data-test-edit-node-description-button]').doesNotExist();
        assert.dom('[data-test-edit-resource-metadata-button]').doesNotExist();
        assert.dom('[data-test-edit-funding-metadata-button]').doesNotExist();
        assert.dom('[data-test-edit-contributors]').doesNotExist();
    });

    test('AVOL', async function(this: TestContext, assert) {
        const node = server.create('node', {
            id: 'mtadt',
            currentUserPermissions: [],
            apiMeta: {
                anonymous: true,
                version: '2.20',
            },
        });
        const url = `/${node.id}/metadata`;

        await visit(url);
        const metadataRecord = await this.owner.lookup('service:store')
            .findRecord('custom-item-metadata-record', node.id);
        assert.equal(currentURL(), url, `We are on ${url}`);
        assert.equal(currentRouteName(), 'guid-node.metadata', 'We are at guid-node.metadata');
        assert.dom('[data-test-display-resource-language]')
            .containsText(languageFromLanguageCode(metadataRecord.language), 'Language is correct');
        assert.dom('[data-test-display-resource-type-general]')
            .containsText(metadataRecord.resourceTypeGeneral, 'Resource type is correct');
        assert.dom('[data-test-display-node-description]')
            .containsText(node.description, 'Description is correct');
        for (const funder of metadataRecord.funders) {
            assert.dom(`[data-test-display-funder-name="${funder.funder_name}"]`)
                .doesNotExist(`Funder name does not exist for ${funder.funder_name}`);
            assert.dom(`[data-test-display-funder-award-title="${funder.funder_name}"]`)
                .doesNotExist(`Funder award title does not exist for ${funder.funder_name}`);
            assert.dom(`[data-test-display-funder-award-uri="${funder.funder_name}"]`)
                .doesNotExist(`Funder award URI does not exist for ${funder.funder_name}`);
            assert.dom(`[data-test-display-funder-award-number="${funder.funder_name}"`)
                .doesNotExist(`Funder award number does not exist for ${funder.funder_name}`);
        }
        assert.dom('[data-test-contributors-list]').doesNotExist('There are no contributors for AVOL');
        assert.dom('[data-test-subjects-list]').doesNotExist('There are no subjects for projects');

        assert.dom('[data-test-edit-node-description-button]').doesNotExist();
        assert.dom('[data-test-edit-resource-metadata-button]').doesNotExist();
        assert.dom('[data-test-edit-funding-metadata-button]').doesNotExist();
        assert.dom('[data-test-edit-contributors]').doesNotExist();
    });

    test('Editable', async function(this: TestContext, assert) {
        const node = server.create('node', {
            id: 'mtadt',
            currentUserPermissions: [Permission.Read, Permission.Write],
        });
        const url = `/${node.id}/metadata`;

        await visit(url);
        const metadataRecord = await this.owner.lookup('service:store')
            .findRecord('custom-item-metadata-record', node.id);
        assert.equal(currentURL(), url, `We are on ${url}`);
        assert.equal(currentRouteName(), 'guid-node.metadata', 'We are at guid-node.metadata');
        assert.dom('[data-test-display-resource-language]')
            .containsText(languageFromLanguageCode(metadataRecord.language), 'Language is correct');
        assert.dom('[data-test-display-resource-type-general]')
            .containsText(metadataRecord.resourceTypeGeneral, 'Resource type is correct');
        assert.dom('[data-test-display-node-description]')
            .containsText(node.description, 'Description is correct');
        for (const funder of metadataRecord.funders) {
            assert.dom(`[data-test-display-funder-name="${funder.funder_name}"]`)
                .containsText(funder.funder_name, `Funder name is correct for ${funder.funder_name}`);
            assert.dom(`[data-test-display-funder-award-title="${funder.funder_name}"]`)
                .containsText(funder.award_title, `Funder award title is correct for ${funder.funder_name}`);
            assert.dom(`[data-test-display-funder-award-uri="${funder.funder_name}"]`)
                .containsText(funder.award_uri,  `Funder award URI is correct for ${funder.funder_name}`);
            assert.dom(`[data-test-display-funder-award-number="${funder.funder_name}"`)
                .containsText(funder.award_number,  `Funder award number is correct for ${funder.funder_name}`);
        }
        assert.dom('[data-test-contributors-list]').exists();
        assert.dom('[data-test-subjects-list]').doesNotExist('There are no subjects for projects');

        assert.dom('[data-test-edit-node-description-button]').exists();
        await click('[data-test-edit-node-description-button]');
        await fillIn('[data-test-description-field] textarea', 'New description');
        await click('[data-test-cancel-editing-node-description-button]');
        assert.dom('[data-test-display-node-description]')
            .doesNotContainText('New description', 'Description is not incorrect after cancelling edit');
        await click('[data-test-edit-node-description-button]');
        await fillIn('[data-test-description-field] textarea', 'New description');
        await click('[data-test-save-node-description-button]');
        assert.dom('[data-test-display-node-description]')
            .containsText('New description', 'Description is changed');

        assert.dom('[data-test-edit-resource-metadata-button]').exists();
        const metadataLanguageOriginal = metadataRecord.language;
        const metadataResourceTypeOriginal = metadataRecord.resourceTypeGeneral;
        await click('[data-test-edit-resource-metadata-button]');
        await selectChoose('[data-test-select-resource-type]', 'InteractiveResource');
        await selectChoose('[data-test-select-resource-language]', 'Esperanto');
        await click('[data-test-cancel-editing-resource-metadata-button]');
        assert.dom('[data-test-display-resource-language]')
            .containsText(languageFromLanguageCode(metadataLanguageOriginal), 'Language is unchanged');
        assert.dom('[data-test-display-resource-type-general]')
            .containsText(metadataResourceTypeOriginal, 'Resource type is unchanged');
        await click('[data-test-edit-resource-metadata-button]');
        await selectChoose('[data-test-select-resource-type]', 'InteractiveResource');
        await selectChoose('[data-test-select-resource-language]', 'Esperanto');
        await click('[data-test-save-resource-metadata-button]');
        assert.dom('[data-test-display-resource-language]')
            .containsText('Esperanto', 'Language is changed');
        assert.dom('[data-test-display-resource-type-general]')
            .containsText('InteractiveResource', 'Resource type is changed');

        assert.dom('[data-test-edit-funding-metadata-button]').exists();
        await click('[data-test-edit-funding-metadata-button]');
        // TODO: Make some changes here with the new funding widget when it's in
        await click('[data-test-cancel-editing-funding-metadata-button]');
        const originalFunders = metadataRecord.funders;
        for (const funder of originalFunders) {
            assert.dom(`[data-test-display-funder-name="${funder.funder_name}"]`)
                .containsText(funder.funder_name, `Funder name is unchanged for ${funder.funder_name}`);
            assert.dom(`[data-test-display-funder-award-title="${funder.funder_name}"]`)
                .containsText(funder.award_title, `Funder award title is unchanged for ${funder.funder_name}`);
            assert.dom(`[data-test-display-funder-award-uri="${funder.funder_name}"]`)
                .containsText(funder.award_uri,  `Funder award URI is unchanged for ${funder.funder_name}`);
            assert.dom(`[data-test-display-funder-award-number="${funder.funder_name}"`)
                .containsText(funder.award_number,  `Funder award number is unchanged for ${funder.funder_name}`);
        }
        // TODO: Test the edit-save flow with the new funding widget when it's in

        assert.dom('[data-test-edit-contributors]').exists();
        assert.dom('[data-test-edit-contributors]').hasAttribute('href', '/mtadt/contributors/');
        await percySnapshot(assert);
    });

    test('Error handling: metadata', async function(this: TestContext, assert) {
        setupOnerror((e: any) => assert.ok(e, 'Error is handled'));
        const node = server.create('node', {
            id: 'mtadt',
            currentUserPermissions: [Permission.Read, Permission.Write],
        });
        const url = `/${node.id}/metadata`;
        server.namespace = '/v2';
        server.patch('/custom_item_metadata_records/:id', () => ({
            errors: [{ detail: 'Could not patch metadata' }],
        }), 400);
        await visit(url);

        await click('[data-test-edit-resource-metadata-button]');
        await selectChoose('[data-test-select-resource-type]', 'InteractiveResource');
        await selectChoose('[data-test-select-resource-language]', 'Esperanto');
        await click('[data-test-save-resource-metadata-button]');
        assert.dom('#toast-container', document as any).hasTextContaining('Could not patch metadata',
            'Toast error shown after failing to update metadata');
        await click('[data-test-cancel-editing-resource-metadata-button]');

        resetOnerror();
    });

    test('Error handling: node', async function(this: TestContext, assert) {
        setupOnerror((e: any) => assert.ok(e, 'Error is handled'));
        const node = server.create('node', {
            id: 'mtadt',
            currentUserPermissions: [Permission.Read, Permission.Write],
        });
        const url = `/${node.id}/metadata`;
        server.namespace = '/v2';
        server.patch('/nodes/:id', () => ({
            errors: [{ detail: 'Could not patch node' }],
        }), 400);
        await visit(url);

        assert.dom('[data-test-display-node-description]')
            .containsText(node.description, 'Description is correct');
        await click('[data-test-edit-node-description-button]');
        await fillIn('[data-test-description-field] textarea', 'New description');
        await click('[data-test-save-node-description-button]');
        assert.dom('#toast-container', document as any).hasTextContaining('Could not patch node',
            'Toast error shown after failing to update node');
        await click('[data-test-cancel-editing-node-description-button]');

        resetOnerror();
    });
});
