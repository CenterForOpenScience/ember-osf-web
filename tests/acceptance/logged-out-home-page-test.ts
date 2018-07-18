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
        assert.notFound('[class*="SignUpForm"] iframe', 'Empty form: no captcha appears.');
        await fillIn('#fullName', 'Test User');
        assert.notFound('[class*="SignUpForm"] iframe', 'Filled in fullName: no captcha appears.');
        await fillIn('#email1', 'test@user.com');
        assert.notFound('[class*="SignUpForm"] iframe', 'Filled in email1: no captcha appears.');
        await fillIn('#email2', 'test@user.com');
        assert.notFound('[class*="SignUpForm"] iframe', 'Filled in email2: no captcha appears.');
        await fillIn('#password', 'correct horse battery staple');
        assert.notFound('[class*="SignUpForm"] iframe', 'Filled in password: no captcha appears.');
        await click('#acceptedTermsOfService');
        assert.found('[class*="SignUpForm"] iframe', 'All fields valid: captcha appears.');
        await click('#acceptedTermsOfService');
        assert.notFound('[class*="SignUpForm"] iframe', 'Invalidate form: captcha disappears.');
        await click('#acceptedTermsOfService');
        assert.found('[class*="SignUpForm"] iframe', 'Revalidate form: captcha reappears.');
        assert.found('[class*="_integrations"] img[alt*="Dropbox logo"]');
        assert.notFound('img[alt*="Missing translation"]');
    });
});
