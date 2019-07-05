import { currentURL, visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

module('Acceptance | old logged-out home page', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('visiting /', async assert => {
        await visit('/old-home');

        assert.equal(currentURL(), '/old-home', "Still at '/old-home'.");

        // Check navbar.
        assert.dom('nav.navbar').exists();
        assert.dom('nav.navbar .service-name').hasText('OSF HOME');
        assert.dom('nav.navbar .sign-in').exists();

        // Check page.
        assert.dom('h1[class*="hero-brand"]').hasText('Open Science Framework');

        // Check footer.
        assert.dom('footer').exists();
        await percySnapshot(assert);

        // Check sign-up form.
        assert.dom('[data-test-sign-up-form] .has-error').doesNotExist('Sign up form: no premature validation');
        assert.dom('[data-test-sign-up-form] .help-block').doesNotExist('Sign up form: no validation messages shown');
        await click('[data-test-sign-up-form] [data-test-sign-up-button]');
        assert.dom('[data-test-sign-up-form] .has-error').exists('Sign up form: validation errors present');
        assert.dom('[data-test-sign-up-form] .help-block').exists('Sign up form: validation messages shown');
        await percySnapshot('Acceptance | logged-out home page | visiting / | sign up form validation');

        // Alt text for integration logos
        assert.dom('[class*="_integrations"] img[alt*="Dropbox logo"]').exists();
    });

    test('visiting /?goodbye=true', async assert => {
        await visit('/?goodbye=true');
        assert.equal(currentURL(), '/?goodbye=true', "Still at '/?goodbye=true'.");

        await percySnapshot(assert);
        assert.dom('a[href="/support"]').exists('Support link exists');
        await click('a[href="/support"]');
        assert.equal(currentURL(), '/support', "Made it to '/support'.");
        assert.dom('a[href="/"]').exists('Home link exists');
        await click('a[href="/"]');
        assert.equal(currentURL(), '/', 'No more query parameter');
    });
});
