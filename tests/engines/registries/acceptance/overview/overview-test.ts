import { ModelInstance } from 'ember-cli-mirage';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import config from 'ember-get-config';
import { TestContext } from 'ember-test-helpers';
import moment from 'moment';
import { module, test } from 'qunit';

import Registration from 'ember-osf-web/models/registration';

import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
import pathJoin from 'ember-osf-web/utils/path-join';

const tagsMap: Record<string, string[]> = {
    title: ['dc.title', 'citation_title', 'og:title'],
    description: ['dc.abstract', 'citation_description', 'og:description'],
    contributors: ['dc.creator', 'citation_author'],
    affiliatedInstitutions: ['citation_author_institution'],
    tags: ['dc.keywords'],
    dateRegistered: ['dc.datesubmitted', 'citation_publication_date'],
    dateModified: ['dc.datemodified'],
    url: ['citation_public_url', 'og:url'],
};

function getMetaTagsFor(assert: Assert, prop: string): Array<string|null> {
    const terms = tagsMap[prop];

    const metaTags = terms.map(term => {
        const k = term.includes('og:') ? 'property' : 'name';
        const selector = `meta[${k}="${term}"]`;
        const elements = [...document.querySelectorAll(selector)];
        return elements.map((el: Element) => el.getAttribute('content'));
    });

    if (metaTags.length > 1) {
        assert.ok(metaTags.every(m => JSON.stringify(m) === JSON.stringify(metaTags[0])));
    }

    return metaTags[0];
}

type RegistrationAttrs = 'title'|'description'|'dateModified'|'dateRegistered';

interface OverviewTestContext extends TestContext {
    registration: ModelInstance<Registration>;
}

module('Registries | Acceptance | overview.overview', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);
    hooks.beforeEach(function(this: OverviewTestContext) {
        this.store = this.owner.lookup('service:store');
        server.loadFixtures('registration-schemas');
        const registration = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            embargoed: true,
        });

        this.set('registration', registration);
    });

    test('Check head meta tags', async function(this: TestContext, assert: Assert) {
        const reg = server.create('registration', {
            description: 'Sun',
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            affiliatedInstitutions: server.createList('institution', 2, {}),
            tags: ['Social Media', 'Education'],
            currentUserPermissions: ['admin'],
        }, 'withContributors');

        const registration: Registration = await this.store.findRecord('registration', reg.id, {
            include: ['registration_schema', 'institution'],
        });

        await visit(`/${registration.id}/`);

        let metaTag;

        // title, description
        ['title', 'description'].forEach((t: RegistrationAttrs) => {
            [metaTag] = getMetaTagsFor(assert, t);
            assert.equal(metaTag, registration[t],
                `Registration.${t} does not match ${tagsMap[t]} head meta`);
        });

        // dateRegistered, datemodified
        ['dateModified', 'dateRegistered'].forEach((t: RegistrationAttrs) => {
            [metaTag] = getMetaTagsFor(assert, t);
            assert.equal(metaTag, moment(registration[t]).format('YYYY-MM-DD'),
                `registration.${t} does not match ${tagsMap[t]} head meta`);
        });

        // registration url
        [metaTag] = getMetaTagsFor(assert, 'url');
        assert.equal(metaTag, pathJoin(config.OSF.url, registration.id),
            `registration url does not match ${tagsMap.url} head meta`);

        // registrations tags
        metaTag = getMetaTagsFor(assert, 'tags');
        assert.ok(JSON.stringify(metaTag) === JSON.stringify(registration.tags),
            `registration.tags do not match ${tagsMap.tags} head meta`);

        const contributors = await registration.loadAll('contributors');
        const institutions = await registration.loadAll('affiliatedInstitutions');

        // contributors
        metaTag = getMetaTagsFor(assert, 'contributors');
        assert.equal(JSON.stringify(metaTag.sort()), JSON.stringify(contributors.mapBy('users.fullName').sort()),
            `registration.contributors do not match ${tagsMap.contributors} head meta`);

        // institutions
        metaTag = getMetaTagsFor(assert, 'affiliatedInstitutions');
        assert.equal(JSON.stringify(metaTag.sort()), JSON.stringify(institutions.mapBy('name').sort()),
            `registration.affiliatedInstitutions do not match ${tagsMap.affiliatedInstitutions} head meta`);
    });

    test('admin can view embargoed registration',
        async function(this: OverviewTestContext, assert: Assert) {
            this.registration.update({ currentUserPermissions: ['admin'] });

            await visit(`/${this.registration.id}/`);

            assert.dom('[data-test-banner="embargoed"]').isVisible();
            assert.dom('[data-test-registration-title]').isVisible();
        });

    test('non-admin contrib can view embargoed registration',
        async function(this: OverviewTestContext, assert: Assert) {
            this.registration.update({
                currentUserPermissions: ['admin'],
            });

            await visit(`/${this.registration.id}/`);

            assert.dom('[data-test-banner="embargoed"]').isVisible();
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
});
