import { click as untrackedClick, fillIn } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import Collection from 'ember-osf-web/models/collection';
import CollectionProvider from 'ember-osf-web/models/collection-provider';
import { Permission } from 'ember-osf-web/models/osf-model';
import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
import { t } from 'ember-intl/test-support';

module('Collections | Acceptance | update', hooks => {
    setupEngineApplicationTest(hooks, 'collections');
    setupMirage(hooks);

    test('it works', async function(assert) {
        server.loadFixtures('licenses');
        const licensesAcceptable = server.schema.licenses.all().models;
        const currentUser = server.create('user', 'loggedIn');
        const primaryCollection = server.create('collection');
        const nodeAdded = server.create('node', {
            title: 'Added to collection',
            license: licensesAcceptable[0],
            currentUserPermissions: Object.values(Permission),
            tags: ['one', 'two', 'three', 'four', 'five'],
        });
        server.create('contributor', {
            node: nodeAdded,
            users: currentUser,
            index: 0,
        });
        const store = this.owner.lookup('service:store');
        const collection: Collection = await store.findRecord('collection', primaryCollection.id);
        collection.collectedTypeChoices.sort();
        collection.issueChoices.sort();
        collection.programAreaChoices.sort();
        collection.statusChoices.sort();
        collection.volumeChoices.sort();
        server.create('collection-submission', {
            creator: currentUser,
            guid: nodeAdded,
            id: nodeAdded.id,
            collection: primaryCollection,
            collectedType: collection.collectedTypeChoices[0],
            issue: collection.issueChoices[0],
            programArea: collection.programAreaChoices[0],
            status: collection.statusChoices[0],
            volume: collection.volumeChoices[0],
        });
        const provider = server.create('collection-provider', {
            id: 'studyswap',
            primaryCollection,
            licensesAcceptable,
        });

        const newTitle = 'New Title';
        const newDescription = 'New description.';

        await visit(`/collections/${provider.id}/${nodeAdded.id}/edit`);

        /* Project metadata */

        await fillIn('[data-test-project-metadata-title] input', newTitle);
        await fillIn('[data-test-project-metadata-description] textarea', newDescription);
        // open license picker
        await untrackedClick('[data-test-project-metadata-license-picker] .ember-power-select-trigger');
        // select first license
        const firstLicenseOption = document.querySelector('.ember-power-select-option');
        if (firstLicenseOption) {
            await untrackedClick(firstLicenseOption);
        }
        // remove third tag
        await untrackedClick(`[data-test-project-metadata-tag="${nodeAdded.tags[2]}"] + .emberTagInput-remove`);

        await percySnapshot('Collections | Acceptance | update | project metadata');
        await untrackedClick('[data-test-project-metadata-save-button]');

        assert.dom('[data-test-project-metadata-complete-title-value]')
            .hasText(newTitle, 'title is updated');
        assert.dom('[data-test-project-metadata-complete-description-value]')
            .hasText(newDescription, 'description is updated');
        const collectionProvider: CollectionProvider = store.peekRecord('collection-provider', provider.id);
        const licenses = await collectionProvider.get('licensesAcceptable');
        const firstLicense = licenses.get('firstObject');
        assert.dom('[data-test-project-metadata-complete-license-name-value]')
            .hasText(firstLicense ? firstLicense.name : '', 'license is updated');
        assert.dom('[data-test-project-metadata-complete-tag]')
            .exists({ count: 4 }, 'only four tags remain');
        nodeAdded.tags.forEach(tag => assert.dom(`[data-test-project-metadata-complete-tag="${tag}"]`)
            .exists({ count: 1 }, `found tag: "${tag}"`));

        /* Project contributors */

        // add contributor
        const userToAdd = server.create('user');
        await fillIn('[data-test-project-contributors-search-box] input', userToAdd.fullName);
        await untrackedClick('[data-test-project-contributors-search-button]');
        const userToAddSelector = `[data-test-project-contributors-search-user="${userToAdd.id}"]`;
        assert.dom(userToAddSelector)
            .exists({ count: 1 }, 'found contributor');
        await untrackedClick(`${userToAddSelector} [data-test-project-contributors-add-contributor-button]`);
        const contribListSelector = `[data-test-project-contributors-list-item-id=${userToAdd.id}]`;
        assert.dom(contribListSelector)
            .exists({ count: 1 }, 'contributor added to list');

        await percySnapshot('Collections | Acceptance | update | added project contributor');
        await untrackedClick('[data-test-collection-project-contributors] [data-test-submit-section-continue]');

        assert.dom(`[data-test-contributor-name="${userToAdd.id}"]`)
            .exists({ count: 1 }, 'contributor added to summary');

        // remove contributor
        await untrackedClick(
            '[data-test-collections-submit-section="projectContributors"] [data-test-submit-section-click-to-edit]',
        );
        await untrackedClick(`${contribListSelector} [data-test-project-contributors-list-item-remove-button]`);
        assert.dom(contribListSelector)
            .doesNotExist('contributor removed from list');

        await percySnapshot('Collections | Acceptance | update | removed project contributor');
        await untrackedClick('[data-test-collection-project-contributors] [data-test-submit-section-continue]');
        assert.dom(`[data-test-contributor-name="${userToAdd.id}"]`)
            .doesNotExist('contributor removed from summary');

        /* Collection metadata */

        await untrackedClick('[data-test-collection-metadata] [data-test-submit-section-continue]');
        const metadataValueSelector = '[data-test-collection-metadata-complete-field-value]';

        // confirm original values are first option
        assert.dom(`[data-test-collection-metadata-complete-field="collectedType"] ${metadataValueSelector}`)
            .hasText(collection.collectedTypeChoices[0], 'collected type in summary is first option');
        assert.dom(`[data-test-collection-metadata-complete-field="issue"] ${metadataValueSelector}`)
            .hasText(collection.issueChoices[0], 'issue in summary is first option');
        assert.dom(`[data-test-collection-metadata-complete-field="programArea"] ${metadataValueSelector}`)
            .hasText(collection.programAreaChoices[0], 'program area in summary is first option');
        assert.dom(`[data-test-collection-metadata-complete-field="status"] ${metadataValueSelector}`)
            .hasText(collection.statusChoices[0], 'status in summary is first option');
        assert.dom(`[data-test-collection-metadata-complete-field="volume"] ${metadataValueSelector}`)
            .hasText(collection.volumeChoices[0], 'volume in summary is first option');

        await untrackedClick(
            '[data-test-collections-submit-section="collectionMetadata"] [data-test-submit-section-click-to-edit]',
        );

        // set collected type to second option
        await untrackedClick('[data-test-metadata-field="collected_type_label"] .ember-power-select-trigger');
        const firstCollectedTypeOption = document.querySelector('[data-option-index="1"].ember-power-select-option');
        if (firstCollectedTypeOption) {
            await untrackedClick(firstCollectedTypeOption);
        } else {
            throw new Error('could not find collected type option');
        }

        // set issue to second option
        await untrackedClick('[data-test-metadata-field="issue_label"] .ember-power-select-trigger');
        const firstIssueOption = document.querySelector('[data-option-index="1"].ember-power-select-option');
        if (firstIssueOption) {
            await untrackedClick(firstIssueOption);
        } else {
            throw new Error('could not find issue option');
        }

        // set program area to second option
        await untrackedClick('[data-test-metadata-field="program_area_label"] .ember-power-select-trigger');
        const firstProgramAreaOption = document.querySelector('[data-option-index="1"].ember-power-select-option');
        if (firstProgramAreaOption) {
            await untrackedClick(firstProgramAreaOption);
        } else {
            throw new Error('could not find program area option');
        }

        // set status to second option
        await untrackedClick('[data-test-metadata-field="status_label"] .ember-power-select-trigger');
        const firstStatusOption = document.querySelector('[data-option-index="1"].ember-power-select-option');
        if (firstStatusOption) {
            await untrackedClick(firstStatusOption);
        } else {
            throw new Error('could not find status option');
        }

        // set volume to second option
        await untrackedClick('[data-test-metadata-field="volume_label"] .ember-power-select-trigger');
        const firstVolumeOption = document.querySelector('[data-option-index="1"].ember-power-select-option');
        if (firstVolumeOption) {
            await untrackedClick(firstVolumeOption);
        } else {
            throw new Error('could not find volume option');
        }

        await percySnapshot('Collections | Acceptance | update | collection metadata');
        await untrackedClick('[data-test-collection-metadata] [data-test-submit-section-continue]');

        // Confirm modified values are second option
        assert.dom(`[data-test-collection-metadata-complete-field="collectedType"] ${metadataValueSelector}`)
            .hasText(collection.collectedTypeChoices[1], 'collected type in summary is second option');
        assert.dom(`[data-test-collection-metadata-complete-field="issue"] ${metadataValueSelector}`)
            .hasText(collection.issueChoices[1], 'issue in summary is second option');
        assert.dom(`[data-test-collection-metadata-complete-field="programArea"] ${metadataValueSelector}`)
            .hasText(collection.programAreaChoices[1], 'program area in summary is second option');
        assert.dom(`[data-test-collection-metadata-complete-field="status"] ${metadataValueSelector}`)
            .hasText(collection.statusChoices[1], 'status in summary is second option');
        assert.dom(`[data-test-collection-metadata-complete-field="volume"] ${metadataValueSelector}`)
            .hasText(collection.volumeChoices[1], 'volume in summary is second option');

        /* Finished */

        await percySnapshot('Collections | Acceptance | update | finished');

        assert.dom('[data-test-collections-remove-button]').exists('remove button exists');
        await untrackedClick('[data-test-delete-button]');
        assert.dom('[data-test-delete-modal-header]').exists('remove modal appears');
        assert.dom('[data-test-delete-modal-body]').containsText(
            t('collections.collections_submission.remove_modal_body', {title: nodeAdded.title}),
        );
    });
});
