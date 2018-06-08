import { click, currentURL, fillIn, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { module, test } from 'qunit';

module('Acceptance | logged-out home page', hooks => {
    setupApplicationTest(hooks);

    test('visiting /', async assert => {
        await visit('/');

        assert.equal(currentURL(), '/', "Still at '/'.");

        // Check navbar.
        assert.found('nav.navbar');
        assert.hasText('nav.navbar .service-name', 'OSF HOME');
        assert.found('nav.navbar .sign-in');

        // Check page.
        assert.hasText('h1[class*="hero-brand"]', 'Open Science Framework');

        // Check footer.
        assert.found('footer');

        // Check sign-up form.
        await fillIn('#fullName', 'Test User');
        await fillIn('#email1', 'test@user.com');
        await fillIn('#email2', 'test@user.com');
        await fillIn('#password', 'correct horse battery staple');
        await click('#acceptedTermsOfService');
        assert.found('[class*="SignUpForm"] iframe', 'Captcha iframe appears.');
    });
});
