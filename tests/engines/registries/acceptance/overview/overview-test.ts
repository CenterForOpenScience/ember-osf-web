import {
    // faker,
    ModelInstance,
} from 'ember-cli-mirage';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import config from 'ember-get-config';
import { TestContext } from 'ember-test-helpers';
import moment from 'moment';
import { module, test } from 'qunit';

import { Permission } from 'ember-osf-web/models/osf-model';
import Registration from 'ember-osf-web/models/registration';
import { visit } from 'ember-osf-web/tests/helpers';
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
        server.loadFixtures('registration-schemas');
        const registration = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            embargoed: true,
        });

        this.set('registration', registration);
    });

    test('admin can view embargoed registration',
        async function(this: OverviewTestContext, assert: Assert) {
            this.registration.update({ currentUserPermissions: Object.values(Permission) });

            await visit(`/${this.registration.id}/`);

            assert.dom('[data-test-banner="embargoed"]').isVisible();
            assert.dom('[data-test-registration-title]').isVisible();
        });

    test('non-admin contrib can view embargoed registration',
        async function(this: OverviewTestContext, assert: Assert) {
            this.registration.update({
                currentUserPermissions: Object.values(Permission),
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

    test('Check head meta tags', async assert => {
        const reg = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            tags: ['Social Media', 'Education'],
            currentUserPermissions: Object.values(Permission),
        }, 'withContributors');

        const affiliatedInstitutions = server.createList('institution', 2, { registrations: [reg] });

        await visit(`/${reg.id}/`);

        assertHeadMetaTags(assert, 'title', reg.title);
        assertHeadMetaTags(assert, 'description', reg.description);
        assertHeadMetaTags(assert, 'dateRegistered', moment(reg.dateRegistered).format('YYYY-MM-DD'));
        assertHeadMetaTags(assert, 'dateModified', moment(reg.dateModified).format('YYYY-MM-DD'));
        assertHeadMetaTags(assert, 'url', pathJoin(config.OSF.url, reg.id as string));
        assertHeadMetaTags(assert, 'image', `${config.assetsPrefix}engines-dist/registries/assets/img/osf-sharing.png`);
        assertHeadMetaTags(assert, 'tags', reg.tags);
        assertHeadMetaTags(assert, 'contributors', reg.contributors.models.mapBy('users.fullName'));
        assertHeadMetaTags(assert, 'affiliatedInstitutions', affiliatedInstitutions.mapBy('name'), true);
    });
});
