import { click, currentURL, fillIn, visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Acceptance | logged-out home page', hooks => {
    setupApplicationTest(hooks);
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

        // Check sign-up form.
        assert.dom('[class*="SignUpForm"] iframe').doesNotExist('Empty form: no captcha appears.');
        await fillIn('#fullName', 'Test User');
        assert.dom('[class*="SignUpForm"] iframe').doesNotExist('Filled in fullName: no captcha appears.');
        await fillIn('#email1', 'test@user.com');
        assert.dom('[class*="SignUpForm"] iframe').doesNotExist('Filled in email1: no captcha appears.');
        await fillIn('#email2', 'test@user.com');
        assert.dom('[class*="SignUpForm"] iframe').doesNotExist('Filled in email2: no captcha appears.');
        await fillIn('#password', 'correct horse battery staple');
        assert.dom('[class*="SignUpForm"] iframe').doesNotExist('Filled in password: no captcha appears.');
        await click('#acceptedTermsOfService');
        assert.dom('[class*="SignUpForm"] iframe').exists('All fields valid: captcha appears.');
        await click('#acceptedTermsOfService');
        assert.dom('[class*="SignUpForm"] iframe').doesNotExist('Invalidate form: captcha disappears.');
        await click('#acceptedTermsOfService');
        assert.dom('[class*="SignUpForm"] iframe').exists('Revalidate form: captcha reappears.');

        // Alt text for integration logos
        assert.dom('[class*="_integrations"] img[alt*="Dropbox logo"]').exists();
        assert.dom('img[alt*="Missing translation"]').doesNotExist();
    });
});
