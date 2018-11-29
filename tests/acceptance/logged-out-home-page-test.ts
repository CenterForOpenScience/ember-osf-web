import { click, currentURL, visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

module('Acceptance | logged-out home page', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('visiting /', async assert => {
        server.create('root', { currentUser: null });
        await visit('/');

        assert.equal(currentURL(), '/', "Still at '/'.");

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
        await percySnapshot(assert);

        // Alt text for integration logos
        assert.dom('[class*="_integrations"] img[alt*="Dropbox logo"]').exists();
    });
});
