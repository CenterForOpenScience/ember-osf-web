import { capitalize } from '@ember/string';
import { click as untrackedClick, fillIn } from '@ember/test-helpers';
import { faker, ModelInstance } from 'ember-cli-mirage';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import config from 'ember-get-config';
import { t } from 'ember-intl/test-support';
import { selectChoose, selectSearch } from 'ember-power-select/test-support';
import { TestContext } from 'ember-test-helpers';
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
            provider: server.create('registration-provider', { id: 'osf' }),
        });

        this.set('registration', registration);
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

    test('only admin can edit registration tags', async assert => {
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

        reg.update({ currentUserPermissions: [Permission.Read] });
        await visit(`/${reg.id}/`);

        assert.dom('[data-test-tags-read-only]').isVisible();
        assert.dom('[data-test-tags-widget-tag-input] input').isNotVisible();
        tags.forEach(tag => assert.dom(`[data-test-tags-widget-tag="${tag}"]`).exists());
    });

    test('only admin can edit affiliated institutions', async assert => {
        const user = server.create('user', {
            institutions: server.createList('institution', 2),
        }, 'loggedIn');

        const reg = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            currentUserPermissions: [Permission.Write, Permission.Read],
        }, 'withAffiliatedInstitutions');

        // Non admin: read only view
        await visit(`/${reg.id}/`);
        assert.dom('[data-test-edit-button="affiliated institutions"]').isNotVisible();
        reg.affiliatedInstitutionIds.forEach(institutionId => assert
            .dom(`[data-test-institution-list-institution="${institutionId}"]`)
            .exists('registration institution list is correct'));

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
        user.institutionIds.every(userInstitutionId =>
            reg.affiliatedInstitutionIds.includes(userInstitutionId));

        // Admin can remove affiliated institutions
        await click('[data-test-edit-button="affiliated institutions"]');

        await click(`[data-test-institution-button="remove-${user.institutionIds[0]}"]`);
        await click(`[data-test-institution-button="remove-${user.institutionIds[1]}"]`);

        assert.dom('[data-test-save-edits]').isVisible();
        await click('[data-test-save-edits]');

        reg.reload();
        user.institutionIds.every(userInstitutionId =>
            !reg.affiliatedInstitutionIds.includes(userInstitutionId));

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
        const blocksWithAnchors = prereg.schemaBlocks!.filter(({ blockType, displayText }) =>
            (
                blockType === 'page-heading' ||
                blockType === 'section-heading' ||
                blockType === 'subsection-heading' ||
                blockType === 'question-label'
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

        // Non-admin cannot edit
        reg.update({ currentUserPermissions: [Permission.Read, Permission.Write] });

        await visit(`/${reg.id}/`);
        assert.dom('[data-test-edit-button="category"]').doesNotExist();
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

        // Non-admin cannot edit
        reg.update({ currentUserPermissions: [] });

        await visit(`/${reg.id}/`);
        assert.dom('[data-test-edit-button="publication DOI"]').doesNotExist();
    });

    test('Check only admin can mint registration DOI', async assert => {
        const reg = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
        });

        await visit(`/${reg.id}/`);
        assert.dom('[data-test-create-doi]').doesNotExist();
        reg.update({ currentUserPermissions: Object.values(Permission) });
        await visit(`/${reg.id}/`);
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
        }, 'isEmbargoed');

        await visit(`/${nonPublicReg.id}/`);
        assert.dom('[data-test-editable-field="doi"]').doesNotExist('DOIs are only available for public registrations');
    });

    test('Editable license', async assert => {
        server.loadFixtures('licenses');
        server.loadFixtures('registration-providers');

        const reg = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            currentUserPermissions: [Permission.Write, Permission.Read],
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

        await click('[data-test-save-license]');

        const missingFields = 'Copyright Holders';
        const validationErrorMsg = t('validationErrors.node_license_missing_fields',
            { missingFields, numOfFields: 1 }).toString();
        assert.dom('.help-block').hasText(validationErrorMsg, 'validation works');

        await fillIn('[data-test-required-field="copyrightHolders"]', 'Jane Doe, John Doe');
        await click('[data-test-save-license]');

        assert.equal(reg.license.name, 'No license');
        assert.equal(reg.nodeLicense!.year, new Date().getUTCFullYear().toString());

        // @ts-ignore
        assert.deepEqual(reg.nodeLicense!.copyright_holders, ['Jane Doe', 'John Doe']);
    });
});
