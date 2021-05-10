import { capitalize } from '@ember/string';
import { click as untrackedClick, fillIn } from '@ember/test-helpers';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import config from 'ember-get-config';
import { t } from 'ember-intl/test-support';
import { percySnapshot } from 'ember-percy';
import { selectChoose, selectSearch } from 'ember-power-select/test-support';
import { TestContext } from 'ember-test-helpers';
import faker from 'faker';
import moment from 'moment';
import { module, test } from 'qunit';

import { NodeCategory } from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';
import Registration from 'ember-osf-web/models/registration';
import { click, visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
import pathJoin from 'ember-osf-web/utils/path-join';

interface OverviewTestContext extends TestContext {
    registration: ModelInstance<Registration>;
}

const tagsMap: Record<string, string[]> = {
    title: ['dc.title', 'citation_title', 'og:title', 'twitter:title'],
    description: ['dc.abstract', 'citation_description', 'og:description', 'twitter:description'],
    contributors: ['dc.creator', 'citation_author'],
    affiliatedInstitutions: ['citation_author_institution'],
    tags: ['dc.keywords'],
    doi: ['citation_doi'],
    dateRegistered: ['dc.datesubmitted', 'citation_publication_date'],
    dateModified: ['dc.datemodified'],
    url: ['citation_public_url', 'og:url', 'og:secure_url'],
    image: ['og:image', 'twitter:image'],
};

function assertHeadMetaTags(assert: Assert, prop: string, expected: string | string[], sort = false) {
    const terms = tagsMap[prop];

    const metaTags = terms.map(term => {
        const k = term.includes('og:') ? 'property' : 'name';
        const selector = `meta[${k}="${term}"]`;
        const elements = [...document.querySelectorAll(selector)];
        return elements.map((el: Element) => el.getAttribute('content'));
    });

    metaTags.slice(1).forEach(m => assert.deepEqual(m, metaTags[0]));

    const actualTags = metaTags[0];
    let expectedTags = expected;

    if (!Array.isArray(expectedTags)) {
        expectedTags = [expectedTags];
    } else if (sort) {
        expectedTags.sort();
        actualTags.sort();
    }

    assert.deepEqual(expectedTags, actualTags, `Head meta tags [${tagsMap[prop]}] match registration.${prop}`);
}

module('Registries | Acceptance | overview.overview', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);
    hooks.beforeEach(function(this: OverviewTestContext) {
        server.loadFixtures('schema-blocks');
        server.loadFixtures('registration-schemas');
        const registration = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            embargoed: true,
            provider: server.create('registration-provider'),
        });

        this.set('registration', registration);
    });

    test('Branded overview page', async assert => {
        const brandedProvider = server.create('registration-provider', {
            assets: {
                favicon: 'fakelink',
            },
        }, 'withBrand');

        const reg = server.create('registration', { provider: brandedProvider });

        await visit(`/${reg.id}/`);
        assert.ok(document.querySelector('link[rel="icon"][href="fakelink"]'));

        const pageTitle = document.getElementsByTagName('title')[0].textContent;
        assert.equal(pageTitle, `${brandedProvider.name} | ${reg.title}`);

        await percySnapshot(assert);
    });

    test('admin can view embargoed registration',
        async function(this: OverviewTestContext, assert: Assert) {
            this.registration.update({ currentUserPermissions: Object.values(Permission) });

            await visit(`/${this.registration.id}/`);

            assert.dom('[data-test-registration-title]').isVisible();
        });

    test('non-admin contrib can view embargoed registration',
        async function(this: OverviewTestContext, assert: Assert) {
            this.registration.update({
                currentUserPermissions: Object.values(Permission),
            });

            await visit(`/${this.registration.id}/`);

            assert.dom('[data-test-registration-title]').isVisible();
        });

    test('non-contrib user cannot view embargoed registration',
        async function(this: OverviewTestContext, assert: Assert) {
            this.registration.update({ currentUserPermissions: [] });

            try {
                await visit(`/${this.registration.id}/`);
            } catch (e) {
                assert.equal(e.errors.length, 1);
                assert.equal(e.errors[0].detail, 'Not found.');
            }
        });

    test('logged out user cannot view embargoed registration',
        async function(this: OverviewTestContext, assert: Assert) {
            try {
                await visit(`/${this.registration.id}/`);
            } catch (e) {
                assert.equal(e.errors.length, 1);
                assert.equal(e.errors[0].detail, 'Not found.');
            }
        });

    test('only write and admin can edit registration tags', async assert => {
        const tags = ['Suspendisse', 'Mauris', 'ipsum', 'facilisis'];
        const reg = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            tags,
            currentUserPermissions: Object.values(Permission),
        });

        await visit(`/${reg.id}/`);

        assert.dom('[data-test-edit-button="tags"]').isVisible();
        await click('[data-test-edit-button="tags"]');

        assert.dom('[data-test-tags]').isVisible();
        assert.dom('[data-test-tags-widget-tag-input="edit"] input').isVisible();
        tags.forEach(tag => assert.dom(`[data-test-tags-widget-tag="${tag}"]`).exists());

        reg.update({ currentUserPermissions: [Permission.Write, Permission.Read] });
        await visit(`/${reg.id}/`);

        assert.dom('[data-test-tags-widget-tag-input="edit"] input').isVisible();

        reg.update({ currentUserPermissions: [Permission.Read] });
        await visit(`/${reg.id}/`);

        assert.dom('[data-test-tags-read-only]').isVisible();
        assert.dom('[data-test-tags-widget-tag-input] input').isNotVisible();
        tags.forEach(tag => assert.dom(`[data-test-tags-widget-tag="${tag}"]`).exists());
    });

    test('only write and admin can edit affiliated institutions', async assert => {
        const user = server.create('user', {
            institutions: server.createList('institution', 2),
        }, 'loggedIn');

        const reg = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            currentUserPermissions: [Permission.Read],
        }, 'withAffiliatedInstitutions');

        // Read user: read only view
        await visit(`/${reg.id}/`);
        assert.dom('[data-test-edit-button="affiliated institutions"]').isNotVisible();
        reg.affiliatedInstitutionIds.forEach(institutionId => assert
            .dom(`[data-test-institution-list-institution="${institutionId}"]`)
            .exists('registration institution list is correct'));

        // Write user: editable view
        reg.update({ currentUserPermissions: [Permission.Read, Permission.Write] });

        await visit(`/${reg.id}/`);
        assert.dom('[data-test-edit-button="affiliated institutions"]').isVisible();

        // Admin: editable view
        reg.update({ currentUserPermissions: Object.values(Permission) });
        await visit(`/${reg.id}/`);

        assert.dom('[data-test-edit-button="affiliated institutions"]').isVisible();

        // Admin can affiliate institutions
        await click('[data-test-edit-button="affiliated institutions"]');
        user.institutionIds.forEach(institutionId => assert
            .dom(`[data-test-institution="${institutionId}"]`)
            .exists('user institution list is correct'));

        await click(`[data-test-institution-button="add-${user.institutionIds[0]}"]`);
        await click(`[data-test-institution-button="add-${user.institutionIds[1]}"]`);

        assert.dom('[data-test-save-edits]').isVisible();
        await click('[data-test-save-edits]');

        reg.reload();
        user.institutionIds.every(userInstitutionId => reg.affiliatedInstitutionIds.includes(userInstitutionId));

        // Admin can remove affiliated institutions
        await click('[data-test-edit-button="affiliated institutions"]');

        await click(`[data-test-institution-button="remove-${user.institutionIds[0]}"]`);
        await click(`[data-test-institution-button="remove-${user.institutionIds[1]}"]`);

        assert.dom('[data-test-save-edits]').isVisible();
        await click('[data-test-save-edits]');

        reg.reload();
        user.institutionIds.every(userInstitutionId => !reg.affiliatedInstitutionIds.includes(userInstitutionId));

        // Discard edits works
        await click('[data-test-edit-button="affiliated institutions"]');

        await click(`[data-test-institution-button="add-${user.institutionIds[0]}"]`);
        await click(`[data-test-institution-button="add-${user.institutionIds[1]}"]`);

        assert.dom('[data-test-discard-edits]').isVisible();
        await click('[data-test-discard-edits]');

        user.institutionIds.forEach(userinstitutionId => assert
            .dom(`[data-test-institution-list-institution="${userinstitutionId}"]`)
            .doesNotExist('registration institution list is not updated after discarding edits'));
    });

    test('Form navigation menu', async assert => {
        const prereg = server.schema.registrationSchemas.find('prereg_challenge');
        const reg = server.create('registration', {
            registrationSchema: prereg,
            currentUserPermissions: Object.values(Permission),
        });
        const blocksWithAnchors = prereg.schemaBlocks!.filter(({ blockType, displayText }) => (
            blockType === 'page-heading'
                || blockType === 'section-heading'
                || blockType === 'subsection-heading'
                || blockType === 'question-label'
        ) && displayText);
        await visit(`/${reg.id}/`);

        assert.dom('[data-test-toggle-anchor-nav-button]').isVisible();
        assert.dom('[data-test-page-anchor]').isNotVisible();

        await click('[data-test-toggle-anchor-nav-button]');

        assert.dom('[data-test-anchor-nav-title]').isVisible();
        assert.dom('[data-test-page-anchor]').exists({ count: blocksWithAnchors.length });
    });

    test('Check head meta tags', async assert => {
        const reg = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            tags: ['Social Media', 'Education'],
            currentUserPermissions: Object.values(Permission),
        }, 'withContributors', 'withDoi');

        const affiliatedInstitutions = server.createList('institution', 2, { registrations: [reg] });

        await visit(`/${reg.id}/`);

        assertHeadMetaTags(assert, 'title', reg.title);
        assertHeadMetaTags(assert, 'description', reg.description);
        assertHeadMetaTags(assert, 'dateRegistered', moment(reg.dateRegistered).format('YYYY-MM-DD'));
        assertHeadMetaTags(assert, 'dateModified', moment(reg.dateModified).format('YYYY-MM-DD'));
        assertHeadMetaTags(assert, 'url', pathJoin(config.OSF.url, reg.id as string));
        assertHeadMetaTags(assert, 'image', 'engines-dist/registries/assets/img/osf-sharing.png');
        assertHeadMetaTags(assert, 'doi', reg.identifiers.models[0].value);
        assertHeadMetaTags(assert, 'tags', reg.tags);
        assertHeadMetaTags(assert, 'contributors', reg.contributors.models.mapBy('users.fullName'));
        assertHeadMetaTags(assert, 'affiliatedInstitutions', affiliatedInstitutions.mapBy('name'), true);
    });

    test('Editable description', async assert => {
        const reg = server.create('registration', {
            currentUserPermissions: Object.values(Permission),
            description: '',
        });

        await visit(`/${reg.id}/`);

        assert.dom('[data-test-edit-button="description"]').isVisible();
        assert.dom('[data-test-description-input]').isNotVisible();
        await click('[data-test-edit-button="description"]');
        assert.dom('[data-test-description-input]').isVisible();

        const newDescription = faker.lorem.sentences(500);

        await fillIn('[data-test-description-input] textarea', newDescription);
        assert.dom('[data-test-save-edits]').isVisible();
        await click('[data-test-save-edits]');

        assert.equal(reg.description, newDescription, 'description successfully updated');
        assert.dom('[data-test-node-description-overlay]').exists('description is truncated');
        assert.dom('[data-test-node-description-button]').exists();
        assert.dom('[data-test-node-description-wrapper]').hasStyle({
            maxHeight: '200px',
        });
        await click('[data-test-node-description-button]');
        assert.dom('[data-test-node-description-wrapper]').hasStyle({
            maxHeight: 'none',
        });

        reg.update({ currentUserPermissions: [Permission.Write, Permission.Read] });
        await visit(`/${reg.id}/`);
        assert.dom('[data-test-edit-button="description"]').isVisible();

        reg.update({ currentUserPermissions: [] });
        await visit(`/${reg.id}/`);
        assert.dom('[data-test-edit-button="description"]').isNotVisible();
    });

    test('editable registration category', async assert => {
        const reg = server.create('registration', {
            currentUserPermissions: Object.values(Permission),
            category: NodeCategory.Project,
        });

        await visit(`/${reg.id}/`);

        await click('[data-test-edit-button="category"]');
        assert.dom('[data-test-select-category] div[class~="ember-power-select-trigger"]')
            .hasText(capitalize(reg.category));

        await untrackedClick('[data-test-select-category] div[class~="ember-power-select-trigger"]');
        assert.dom('.ember-power-select-option').exists({ count: Object.values(NodeCategory).length - 1 });

        await selectChoose('[data-test-select-category]', capitalize(NodeCategory.Instrumentation));
        await click('[data-test-save-edits]');

        reg.reload();
        assert.equal(reg.category, NodeCategory.Instrumentation);

        // Read user cannot edit
        reg.update({ currentUserPermissions: [Permission.Read] });

        await visit(`/${reg.id}/`);
        assert.dom('[data-test-edit-button="category"]').doesNotExist();

        // Write user can edit
        reg.update({ currentUserPermissions: [Permission.Read, Permission.Write] });

        await visit(`/${reg.id}/`);
        assert.dom('[data-test-edit-button="category"]').exists();
    });

    test('editable publication doi', async assert => {
        const reg = server.create('registration', {
            currentUserPermissions: Object.values(Permission),
        });

        await visit(`/${reg.id}/`);

        await click('[data-test-edit-button="publication DOI"]');

        assert.notOk(reg.articleDoi);
        assert.dom('[data-test-publication-doi-input] input').isVisible();

        const invalidDoi = '10.123213';
        await fillIn('[data-test-publication-doi-input] input', invalidDoi);
        await click('[data-test-save-publication-doi]');

        assert.dom('.help-block').hasText('Please use a valid DOI format (10.xxxx/xxxxx)', 'validation works');
        await untrackedClick('[data-test-cancel-publication-doi]');

        await click('[data-test-edit-button="publication DOI"]');
        assert.dom('.help-block').isNotVisible();

        const publicationDoi = '10.12312/123';
        await fillIn('[data-test-publication-doi-input] input', publicationDoi);
        await click('[data-test-save-publication-doi]');

        reg.reload();
        assert.ok(reg.articleDoi);
        assert.equal(reg.articleDoi, publicationDoi);

        // Can delete publication DOI
        await click('[data-test-edit-button="publication DOI"]');
        await fillIn('[data-test-publication-doi-input] input', '');
        await click('[data-test-save-publication-doi]');

        reg.reload();
        assert.notOk(reg.articleDoi);

        // Read-Write can edit
        reg.update({ currentUserPermissions: [Permission.Write, Permission.Read] });

        await visit(`/${reg.id}/`);
        assert.dom('[data-test-edit-button="publication DOI"]').exists();

        // Read-only cannot edit
        reg.update({ currentUserPermissions: [Permission.Read] });

        await visit(`/${reg.id}/`);
        assert.dom('[data-test-edit-button="publication DOI"]').doesNotExist();
    });

    test('Check only admin can mint registration DOI', async assert => {
        const reg = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
        });

        await visit(`/${reg.id}/`);
        assert.dom('[data-test-edit-button="doi"]').doesNotExist();
        assert.dom('[data-test-create-doi]').doesNotExist();

        reg.update({ currentUserPermissions: [Permission.Read] });
        await visit(`/${reg.id}/`);
        assert.dom('[data-test-edit-button="doi"]').doesNotExist();
        assert.dom('[data-test-create-doi]').doesNotExist();

        reg.update({ currentUserPermissions: [Permission.Write, Permission.Read] });
        await visit(`/${reg.id}/`);
        assert.dom('[data-test-edit-button="doi"]').doesNotExist();
        assert.dom('[data-test-create-doi]').doesNotExist();

        reg.update({ currentUserPermissions: Object.values(Permission) });
        await visit(`/${reg.id}/`);
        await click('[data-test-edit-button="doi"]');

        assert.dom('[data-test-create-doi]').isVisible();

        await click('[data-test-edit-button="doi"]');

        assert.dom('[data-test-create-doi]').isVisible();

        assert.dom('[data-test-registration-doi]').isNotVisible();
        assert.notOk(Boolean(reg.identifierIds.length));

        await click('[data-test-create-doi]');

        assert.dom('[data-test-registration-doi]').isVisible();
        reg.reload();
        assert.ok(Boolean(reg.identifierIds.length), 'Registration doi successfully minted');
        assert.dom('[data-test-edit-button="doi"]').isNotVisible('A registration doi can only be minted once');

        const nonPublicReg = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            currentUserPermissions: Object.values(Permission),
        }, 'isEmbargo');

        await visit(`/${nonPublicReg.id}/`);
        assert.dom('[data-test-editable-field="doi"]').doesNotExist('DOIs are only available for public registrations');
    });

    test('Editable provider metadata', async assert => {
        server.create('user', 'loggedIn');

        const regOne = server.create('registration', {
            currentUserPermissions: Object.values(Permission),
            provider: server.schema.registrationProviders.find('osf'),
            providerSpecificMetadata: [
                { field_name: 'Field 1', field_value: '' },
                { field_name: 'Field 2', field_value: 'Value 2' },
            ],
        });
        const regTwo = server.create('registration', {
            currentUserPermissions: [Permission.Read],
            provider: server.create('registration-provider', 'currentUserIsModerator'),
            providerSpecificMetadata: [
                { field_name: 'Field 1', field_value: '' },
                { field_name: 'Field 2', field_value: 'Value b' },
            ],
        });
        const regThree = server.create('registration', {
            currentUserPermissions: Object.values(Permission),
            provider: server.schema.registrationProviders.find('osf'),
        });
        const regFour = server.create('registration', {
            currentUserPermissions: Object.values(Permission),
            provider: server.create('registration-provider', 'currentUserIsModerator'),
            providerSpecificMetadata: [
                { field_name: 'Field 1', field_value: '' },
                { field_name: 'Field 2', field_value: '' },
            ],
        });

        await visit(`/${regOne.id}/`);
        assert.dom('[data-test-edit-button="metadata"]').isNotVisible('Non moderator cannot edit provider metadata');
        assert.dom('[data-test-registration-provider-metadata-wrapper]')
            .isVisible('Non moderator can see at least one display component');
        assert.dom('[data-test-registration-provider-metadata-wrapper="Field 1"]')
            .isVisible('Non moderator can see the field 1 display component');
        assert.dom('[data-test-registration-provider-metadata-field-value="Field 1"]')
            .doesNotContainText('Non-moderator field one starts out empty');
        assert.dom('[data-test-registration-provider-metadata-wrapper="Field 2"]')
            .isVisible('Non moderator can see the field 2 display component');
        assert.dom('[data-test-registration-provider-metadata-field-value="Field 2"]')
            .containsText('Value 2', 'Non-moderator field two has the correct value');

        await visit(`/${regTwo.id}/`);
        assert.dom('[data-test-edit-button="metadata"]').isVisible('Moderator can edit provider metadata');
        assert.dom('[data-test-registration-provider-metadata-wrapper="Field 1"]')
            .isVisible('Moderator can see the field 1 display component');
        assert.dom('[data-test-registration-provider-metadata-field-value="Field 1"]')
            .doesNotContainText('Moderator field one starts out empty');
        assert.dom('[data-test-registration-provider-metadata-wrapper="Field 2"]')
            .isVisible('Moderator can see the field 2 display component');
        assert.dom('[data-test-registration-provider-metadata-field-value="Field 2"]')
            .containsText('Value b', 'Moderator field two has the correct value');
        assert.dom('[data-test-provider-metadata-edit-input="Field 1"]')
            .isNotVisible('Moderator cannot yet see edit dialog box');
        await click('[data-test-edit-button="metadata"]');
        assert.dom('[data-test-provider-metadata-edit-input="Field 1"]')
            .isVisible('Moderator can see edit dialog box');
        await fillIn('[data-test-provider-metadata-edit-input="Field 1"]', 'Value 1');
        await fillIn('[data-test-provider-metadata-edit-input="Field 2"]', 'Value 2');
        await click('[data-test-save-edits]');
        assert.dom('[data-test-registration-provider-metadata-field-value="Field 1"]')
            .containsText('Value 1', 'Moderator successfully changed field 1');
        assert.dom('[data-test-registration-provider-metadata-field-value="Field 2"]')
            .containsText('Value 2', 'Moderator successfully changed field 2');
        await click('[data-test-edit-button="metadata"]');
        assert.dom('[data-test-provider-metadata-edit-input="Field 1"]')
            .isVisible('Moderator can see edit dialog box');
        await fillIn('[data-test-provider-metadata-edit-input="Field 1"]', 'Bad valu 1');
        await fillIn('[data-test-provider-metadata-edit-input="Field 2"]', 'Bad valu 2');
        await click('[data-test-discard-edits]');
        assert.dom('[data-test-registration-provider-metadata-field-value="Field 1"]')
            .containsText('Value 1', 'Moderator successfully discarded field 1');
        assert.dom('[data-test-registration-provider-metadata-field-value="Field 2"]')
            .containsText('Value 2', 'Moderator successfully discarded field 2');

        await visit(`/${regThree.id}/`);
        assert.dom('[data-test-registration-provider-metadata-wrapper]')
            .isNotVisible('No metadata means nothing to display');

        await visit(`/${regFour.id}/`);
        assert.dom('[data-test-editable-field="metadata"]')
            .isVisible('All empty fields still shows component');
        assert.dom('[data-test-editable-field-provider-metadata]')
            .containsText('No metadata', 'All empty fields means no metadata to show');
    });

    test('Editable license', async assert => {
        server.loadFixtures('licenses');

        const reg = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            currentUserPermissions: [Permission.Write, Permission.Read],
            provider: server.schema.registrationProviders.find('osf'),
        });

        await visit(`/${reg.id}/`);

        assert.dom('[data-test-edit-button="license"]').isNotVisible();
        reg.update({ currentUserPermissions: Object.values(Permission) });

        await visit(`/${reg.id}/`);

        assert.dom('[data-test-edit-button="license"]').isVisible();

        await click('[data-test-edit-button="license"]');

        assert.dom('[data-test-license-edit-form]').isVisible();
        await selectSearch('[data-test-power-select-dropdown]', 'MIT');
        assert.dom('.ember-power-select-options').hasText('MIT License');
        await selectSearch('[data-test-power-select-dropdown]', 'No');
        assert.dom('.ember-power-select-options').hasText('No license');
        await selectChoose('[data-test-power-select-dropdown]', 'No license');

        const validationErrorMsg = t('validationErrors.invalid_copyright_holders').toString();
        assert.dom('.help-block').hasText(validationErrorMsg, 'validation works');

        await fillIn('[data-test-required-field="nodeLicense.copyrightHolders"]', 'Jane Doe, John Doe');
        await click('[data-test-save-license]');

        assert.equal(reg.license.name, 'No license');
        assert.equal(reg.nodeLicense!.year, new Date().getUTCFullYear().toString());

        // @ts-ignore: TODO: use copyrightHolders?
        assert.deepEqual(reg.nodeLicense!.copyright_holders, ['Jane Doe', 'John Doe']);
    });

    test('File links show on registration detail', async assert => {
        const openEndedReg = server.schema.registrationSchemas.find('open_ended_registration');
        const registeredFrom = server.create('node', 'currentUserAdmin');
        const fileOne = server.create('file', { target: registeredFrom });
        const fileTwo = server.create('file', { target: registeredFrom });
        const registrationResponses = {
            summary: 'Test file links',
            uploader: [fileOne.fileReference, fileTwo.fileReference],
        };

        const reg = server.create('registration', {
            registrationSchema: openEndedReg,
            currentUserPermissions: Object.values(Permission),
            registrationResponses,
            registeredFrom,
        });

        await visit(`/${reg.id}/`);

        assert.dom('[data-test-read-only-file-widget]').isVisible();
        assert.dom(`[data-test-file-link="${fileOne.id}"]`).hasText(fileOne.name);
        assert.dom(`[data-test-file-link="${fileOne.id}"]`).hasAttribute('href', `fakedomain/${fileOne.id}`);
        assert.dom(`[data-test-file-link="${fileTwo.id}"]`).hasText(fileTwo.name);
        assert.dom(`[data-test-file-link="${fileTwo.id}"]`).hasAttribute('href', `fakedomain/${fileTwo.id}`);
    });

    test('File links show on registration detail from registrations list', async assert => {
        const openEndedReg = server.schema.registrationSchemas.find('open_ended_registration');
        const registeredFrom = server.create('node', 'currentUserAdmin');
        const fileOne = server.create('file', { target: registeredFrom });
        const fileTwo = server.create('file', { target: registeredFrom });
        const registrationResponses = {
            summary: 'Test file links',
            uploader: [fileOne.fileReference, fileTwo.fileReference],
        };

        const reg = server.create('registration', {
            registrationSchema: openEndedReg,
            currentUserPermissions: Object.values(Permission),
            registrationResponses,
            registeredFrom,
        });

        await visit(`/--node/${registeredFrom.id}/registrations`);

        assert.dom('[data-test-node-card]').exists({ count: 1 });

        await click(`[data-test-node-title="${reg.id}"]`);

        assert.dom('[data-test-read-only-file-widget]').isVisible();
        assert.dom(`[data-test-file-link="${fileOne.id}"]`).hasText(fileOne.name);
        assert.dom(`[data-test-file-link="${fileOne.id}"]`).hasAttribute('href', `fakedomain/${fileOne.id}`);
        assert.dom(`[data-test-file-link="${fileTwo.id}"]`).hasText(fileTwo.name);
        assert.dom(`[data-test-file-link="${fileTwo.id}"]`).hasAttribute('href', `fakedomain/${fileTwo.id}`);
    });

    test('Logged out user can claim an unregistered contributor', async assert => {
        const openEndedReg = server.schema.registrationSchemas.find('open_ended_registration');
        const registeredFrom = server.create('node');

        const reg = server.create('registration', {
            registrationSchema: openEndedReg,
            registeredFrom,
        }, 'withContributors');
        const unregContributor = server.create('contributor', { node: reg }, 'unregistered');

        await visit(`/${reg.id}`);

        assert.dom('[data-test-unregistered-contributor-name]').exists('unregistered contributor exists');
        await click('[data-test-unregistered-contributor-name]');
        await percySnapshot('Claim unregistered contributor for logged out users, no validation errors');
        assert.dom('[data-test-modal-heading]').containsText(unregContributor.unregisteredContributor!,
            'claim unregistered user modal header contains unregistered contributor name');
        await fillIn('[data-test-email-input]', 'lmnop');
        assert.dom('[data-test-validation-errors="userEmail"]')
            .exists('validation error shows after invalid email is entered');
        await percySnapshot('Claim unregistered contributor for logged out users, with validation errors');
        await fillIn('[data-test-email-input]', 'lmnop@abd.xyz');
        assert.dom('[data-test-modal-claim-button]')
            .isEnabled('claim unregistered user modal claim button is enabled after user enters valid email');
        await click('[data-test-modal-cancel-button]');
        assert.dom('[data-test-modal-heading]')
            .doesNotExist('claim unregistered user modal gone after canceling claim');
    });

    test('Logged in user can claim an unregistered contributor', async assert => {
        const currentUser = server.create('user', 'loggedIn');
        const openEndedReg = server.schema.registrationSchemas.find('open_ended_registration');
        const registeredFrom = server.create('node');

        const reg = server.create('registration', {
            registrationSchema: openEndedReg,
            registeredFrom,
        }, 'withContributors');
        server.create('contributor', { node: reg }, 'unregistered');

        await visit(`/${reg.id}`);
        assert.dom('[data-test-unregistered-contributor-name]').exists('unregistered contributor exists');
        await click('[data-test-unregistered-contributor-name]');
        await percySnapshot(assert);
        assert.dom('[data-test-modal-heading]').containsText(currentUser.emails.models[0].emailAddress,
            'claim unregistered user modal header contains current users email');
        assert.dom('[data-test-modal-claim-button]')
            .isEnabled('claim unregistered user modal has claim button that is enabled');
        await click('[data-test-modal-cancel-button]');
        assert.dom('[data-test-modal-heading]')
            .doesNotExist('claim unregistered user modal gone after canceling claim');
    });
});
