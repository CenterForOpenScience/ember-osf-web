import { click as untrackedClick, fillIn } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import faker from 'faker';
import { module, test } from 'qunit';

import CollectionProvider from 'ember-osf-web/models/collection-provider';
import { CollectionSubmissionReviewStates } from 'ember-osf-web/models/collection-submission';
import { Permission } from 'ember-osf-web/models/osf-model';
import { click, visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

module('Collections | Acceptance | submit', hooks => {
    setupEngineApplicationTest(hooks, 'collections');
    setupMirage(hooks);

    test('it works', async function(assert) {
        server.loadFixtures('licenses');
        const currentUser = server.create('user', 'loggedIn');
        const primaryCollection = server.create('collection');
        const nodeToBeAdded = server.create('node', {
            title: 'Node to be added to collection',
            currentUserPermissions: Object.values(Permission),
            tags: faker.lorem.words(5).split(' '),
        });
        server.create('contributor', {
            node: nodeToBeAdded,
            users: currentUser,
            index: 0,
        });
        const licensesAcceptable = server.schema.licenses.all().models;
        const provider = server.create('collection-provider', {
            id: 'studyswap',
            primaryCollection,
            licensesAcceptable,
        });

        const store = this.owner.lookup('service:store');

        const newTitle = 'New Title';
        const newDescription = 'New description.';

        await visit(`/collections/${provider.id}/submit`);

        /* Select a project */

        await percySnapshot('Collections | Acceptance | submit | select project');

        // open item picker
        await untrackedClick('[data-test-collections-item-picker] .ember-power-select-trigger');
        // select node
        const nodeToBeAddedOption = document.querySelector(
            `[data-test-collections-node-title="${nodeToBeAdded.title}"]`,
        );
        if (nodeToBeAddedOption) {
            await untrackedClick(nodeToBeAddedOption);
        }

        /* Project metadata */

        await percySnapshot('Collections | Acceptance | submit | project metadata');

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
        await untrackedClick(`[data-test-project-metadata-tag="${nodeToBeAdded.tags[2]}"] + .emberTagInput-remove`);
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
        nodeToBeAdded.tags.forEach(tag => assert.dom(`[data-test-project-metadata-complete-tag="${tag}"]`)
            .exists({ count: 1 }, `found tag: "${tag}"`));

        /* Project contributors */

        await percySnapshot('Collections | Acceptance | submit | project contributors');

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
        await untrackedClick('[data-test-collection-project-contributors] [data-test-submit-section-continue]');
        assert.dom(`[data-test-contributor-name="${userToAdd.id}"]`)
            .doesNotExist('contributor removed from summary');

        /* Collection metadata */

        await percySnapshot('Collections | Acceptance | submit | collection metadata');

        assert.dom('[data-test-collection-metadata] [data-test-submit-section-continue]')
            .isDisabled('metadata continue is disabled');

        await untrackedClick('[data-test-metadata-field="collected_type_label"] .ember-power-select-trigger');
        const firstCollectedTypeOption = document.querySelector('.ember-power-select-option');
        if (firstCollectedTypeOption) {
            await untrackedClick(firstCollectedTypeOption);
        } else {
            throw new Error('could not find collected type option');
        }

        await untrackedClick('[data-test-metadata-field="issue_label"] .ember-power-select-trigger');
        const firstIssueOption = document.querySelector('.ember-power-select-option');
        if (firstIssueOption) {
            await untrackedClick(firstIssueOption);
        } else {
            throw new Error('could not find issue option');
        }

        await untrackedClick('[data-test-metadata-field="program_area_label"] .ember-power-select-trigger');
        const firstProgramAreaOption = document.querySelector('.ember-power-select-option');
        if (firstProgramAreaOption) {
            await untrackedClick(firstProgramAreaOption);
        } else {
            throw new Error('could not find program area option');
        }

        await untrackedClick('[data-test-metadata-field="status_label"] .ember-power-select-trigger');
        const firstStatusOption = document.querySelector('.ember-power-select-option');
        if (firstStatusOption) {
            await untrackedClick(firstStatusOption);
        } else {
            throw new Error('could not find status option');
        }

        await untrackedClick('[data-test-metadata-field="volume_label"] .ember-power-select-trigger');
        const firstVolumeOption = document.querySelector('.ember-power-select-option');
        if (firstVolumeOption) {
            await untrackedClick(firstVolumeOption);
        } else {
            throw new Error('could not find volume option');
        }

        // fields only available for Character Lab
        await untrackedClick('[data-test-metadata-field="school_type_label"] .ember-power-select-trigger');
        const firstSchoolTypeOption = document.querySelector('.ember-power-select-option');
        if (firstSchoolTypeOption) {
            await untrackedClick(firstSchoolTypeOption);
        } else {
            throw new Error('could not find school type option');
        }

        await untrackedClick('[data-test-metadata-field="study_design_label"] .ember-power-select-trigger');
        const firstStudyDesignOption = document.querySelector('.ember-power-select-option');
        if (firstStudyDesignOption) {
            await untrackedClick(firstStudyDesignOption);
        } else {
            throw new Error('could not find study design option');
        }

        assert.dom('[data-test-collection-metadata] [data-test-submit-section-continue]')
            .isNotDisabled('metadata continue is not disabled');
        await untrackedClick('[data-test-collection-metadata] [data-test-submit-section-continue]');

        const metadataValueSelector = '[data-test-collection-metadata-complete-field-value]';
        const collection = await collectionProvider.get('primaryCollection');
        assert.dom(`[data-test-collection-metadata-complete-field="collectedType"] ${metadataValueSelector}`)
            .hasText(collection.collectedTypeChoices[0], 'collected type in summary');
        assert.dom(`[data-test-collection-metadata-complete-field="issue"] ${metadataValueSelector}`)
            .hasText(collection.issueChoices[0], 'issue in summary');
        assert.dom(`[data-test-collection-metadata-complete-field="programArea"] ${metadataValueSelector}`)
            .hasText(collection.programAreaChoices[0], 'program area in summary');
        assert.dom(`[data-test-collection-metadata-complete-field="status"] ${metadataValueSelector}`)
            .hasText(collection.statusChoices[0], 'status in summary');
        assert.dom(`[data-test-collection-metadata-complete-field="volume"] ${metadataValueSelector}`)
            .hasText(collection.volumeChoices[0], 'volume in summary');

        /* Add to collection */

        await click('[data-test-collections-submit-submit-button]');
        assert.dom('[data-test-collection-submission-confirmation-modal-header]')
            .exists({ count: 1 }, 'confirmation modal is displayed');
        assert.dom('[data-test-collection-submission-confirmation-modal-body]').exists();
        assert.dom('[data-test-collection-submission-confirmation-modal-moderated-body]')
            .doesNotExist('No moderation message is displayed for non-moderated collections');
        await percySnapshot('Collections | Acceptance | submit | confirm public modal');

        await click('[data-test-collection-submission-confirmation-modal-cancel-button]');
        assert.dom('[data-test-collection-submission-confirmation-modal-header]')
            .doesNotExist('confirmation modal is dismissed');

        collectionProvider.reviewsWorkflow = 'pre-moderation';
        await click('[data-test-collections-submit-submit-button]');
        assert.dom('[data-test-collection-submission-confirmation-modal-body]').exists();
        assert.dom('[data-test-collection-submission-confirmation-modal-moderated-body]')
            .exists('Moderation message is displayed for moderated collections');
    });

    test('it resubmits', async function(assert) {
        server.loadFixtures('licenses');
        const currentUser = server.create('user', 'loggedIn');
        const primaryCollection = server.create('collection', {
            volumeChoices: [],
            issueChoices: [],
            statusChoices: [],
            programAreaChoices: [],
            studyDesignChoices: [],
            schoolTypeChoices: [],
        });
        const nodeAlreadyAdded = server.create('node', {
            title: 'Node to be added to collection',
            currentUserPermissions: Object.values(Permission),
            tags: faker.lorem.words(5).split(' '),
            license: server.schema.licenses.all().models[0],
        });
        server.create('contributor', {
            node: nodeAlreadyAdded,
            users: currentUser,
            index: 0,
        });
        const licensesAcceptable = server.schema.licenses.all().models;
        server.create('collection-submission', {
            id: `${primaryCollection.id}-${nodeAlreadyAdded.id}`,
            creator: currentUser,
            collection: primaryCollection,
            guid: nodeAlreadyAdded,
            reviewsState: CollectionSubmissionReviewStates.Rejected,
        });
        const provider = server.create('collection-provider', {
            id: 'studyswap',
            primaryCollection,
            licensesAcceptable,
        });

        await visit(`/collections/${provider.id}/submit`);

        // open item picker
        await untrackedClick('[data-test-collections-item-picker] .ember-power-select-trigger');
        // select node
        const nodeOption = document.querySelector(
            `[data-test-collections-node-title="${nodeAlreadyAdded.title}"]`,
        );
        if (nodeOption) {
            await untrackedClick(nodeOption);
        }

        /* Project metadata */
        await untrackedClick('[data-test-project-metadata-save-button]');
        /* Project contributors */
        await untrackedClick('[data-test-submit-section-continue]');

        /* Collection metadata */
        await untrackedClick('[data-test-metadata-field="collected_type_label"] .ember-power-select-trigger');
        const firstCollectedTypeOption = document.querySelector('.ember-power-select-option');
        if (firstCollectedTypeOption) {
            await untrackedClick(firstCollectedTypeOption);
        } else {
            throw new Error('could not find collected type option');
        }

        assert.dom('[data-test-collection-metadata] [data-test-submit-section-continue]')
            .isNotDisabled('metadata continue is not disabled');
        await untrackedClick('[data-test-collection-metadata] [data-test-submit-section-continue]');

        /* Resubmit modal */
        await click('[data-test-collections-submit-submit-button]');
        assert.dom('[data-test-collection-submission-confirmation-modal-header]')
            .exists({ count: 1 }, 'confirmation modal is displayed');
        assert.dom('[data-test-collection-submission-confirmation-modal-body]').doesNotExist();
        assert.dom('[data-test-collection-submission-confirmation-modal-moderated-body]')
            .doesNotExist('No moderation message is displayed for non-moderated collections');
        assert.dom('[data-test-collection-submission-confirmation-modal-resubmit]')
            .exists('Resubmit message is displayed');
        assert.dom('[data-test-collection-submission-confirmation-modal-resubmit-button]')
            .exists('Resubmit button is displayed');
        assert.dom('[data-test-collection-submission-confirmation-modal-add-button]').doesNotExist();
    });
});
