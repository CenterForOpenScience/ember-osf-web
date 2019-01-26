import { currentURL, visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

module('Acceptance | register (sign up page)', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('visiting /register', async assert => {
        await visit('/register');

        assert.equal(currentURL(), '/register', "Still at '/register'.");

        assert.dom('[data-analytics-name="ORCID"]').exists();
        assert.dom('[data-analytics-name="Institution"]').exists();
        assert.dom('[data-test-sign-up-full-name]').exists();
        await percySnapshot(assert);
    });

    test('visiting /register?next=foo', async assert => {
        await visit('/register?next=foo');

        assert.equal(currentURL(), '/register?next=foo', "Still at '/register?next=foo'.");

        assert.dom('[data-analytics-name="Institution"][href$="%3Fnext%3Dfoo"]')
            .exists('Institutions button link ends with encoded next.');
    });

    module('Campaigns', nestedHooks => {
        nestedHooks.beforeEach(() => server.loadFixtures('preprint-providers'));

        test('visiting /register?campaign=osf-registries', async assert => {
            await visit('/register?campaign=osf-registries');

            assert.equal(
                currentURL(),
                '/register?campaign=osf-registries',
                "Still at '/register?campaign=osf-registries'.",
            );

            assert.dom('[data-test-register-osf-registries-logo]').exists();
            assert.dom('[data-test-register-provider-logo]').doesNotExist();
            assert.dom('[data-test-register-provider-name]').doesNotExist();
            await percySnapshot(assert);
        });

        test('visiting /register?campaign=osf-preprints', async assert => {
            await visit('/register?campaign=osf-preprints');

            assert.equal(
                currentURL(),
                '/register?campaign=osf-preprints',
                "Still at '/register?campaign=osf-preprints'.",
            );

            assert.dom('[data-test-register-osf-preprints-logo]').exists();
            assert.dom('[data-test-register-provider-logo]').doesNotExist();
            assert.dom('[data-test-register-provider-name]').doesNotExist();
            await percySnapshot(assert);
        });

        test('visiting /register?campaign=thesiscommons-preprints', async assert => {
            await visit('/register?campaign=thesiscommons-preprints');

            assert.equal(
                currentURL(),
                '/register?campaign=thesiscommons-preprints',
                "Still at '/register?campaign=thesiscommons-preprints'.",
            );

            assert.dom('[data-test-register-provider-logo=thesiscommons]').exists();
            assert.dom('[data-test-register-provider-name]').hasText('Thesis Commons');
            await percySnapshot(assert);
        });

        test('visiting /register?campaign=preprintrxiv-preprints', async assert => {
            await visit('/register?campaign=preprintrxiv-preprints');

            assert.equal(
                currentURL(),
                '/register?campaign=preprintrxiv-preprints',
                "Still at '/register?campaign=preprintrxiv-preprints'.",
            );

            assert.dom('[data-test-register-provider-logo=preprintrxiv]').exists();
            assert.dom('[data-test-register-provider-name]').hasText('PreprintrXiv Preprints');
            await percySnapshot(assert);
        });

        test('visiting /register?campaign=paperxiv-preprints', async assert => {
            await visit('/register?campaign=paperxiv-preprints');

            assert.equal(
                currentURL(),
                '/register?campaign=paperxiv-preprints',
                "Still at '/register?campaign=paperxiv-preprints'.",
            );

            assert.dom('[data-test-register-provider-logo=paperxiv]').exists();
            assert.dom('[data-test-register-provider-name]').hasText('PaperXiv Papers');
            await percySnapshot(assert);
        });

        test('visiting /register?campaign=thesisrxiv-preprints', async assert => {
            await visit('/register?campaign=thesisrxiv-preprints');

            assert.equal(
                currentURL(),
                '/register?campaign=thesisrxiv-preprints',
                "Still at '/register?campaign=thesisrxiv-preprints'.",
            );

            assert.dom('[data-test-register-provider-logo=thesisrxiv]').exists();
            assert.dom('[data-test-register-provider-name]').hasText('ThesisrXiv Theses');
            await percySnapshot(assert);
        });

        test('visiting /register?campaign=workrxiv-preprints', async assert => {
            await visit('/register?campaign=workrxiv-preprints');

            assert.equal(
                currentURL(),
                '/register?campaign=workrxiv-preprints',
                "Still at '/register?campaign=workrxiv-preprints'.",
            );

            assert.dom('[data-test-register-provider-logo=workrxiv]').exists();
            assert.dom('[data-test-register-provider-name]').hasText('WorkrXiv Works');
            await percySnapshot(assert);
        });

        test('visiting /register?campaign=docrxiv-preprints', async assert => {
            await visit('/register?campaign=docrxiv-preprints');

            assert.equal(
                currentURL(),
                '/register?campaign=docrxiv-preprints',
                "Still at '/register?campaign=docrxiv-preprints'.",
            );

            assert.dom('[data-test-register-provider-logo=docrxiv]').exists();
            assert.dom('[data-test-register-provider-name]').hasText('DocrXiv Documents');
            await percySnapshot(assert);
        });
    });
});
