import { currentURL, visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

module('Acceptance | new home page test', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('visiting new-home', async assert => {
        await visit('/new-home');

        assert.equal(currentURL(), '/new-home', "Still at 'new-home'.");
        // Check navbar
        assert.dom('nav.navbar').exists();
        assert.dom('nav.navbar .service-name').hasText('OSF HOME');
        assert.dom('nav.navbar .sign-in').exists();

        // Check page
        assert.dom('[data-test-hero-heading]').hasText('The place to share your research');
        assert.dom('[data-test-hero-subheading]')
            .hasText('OSF is a free, open platform to support your research and enable collaboration.');

        // Check footer.
        assert.dom('footer').exists();
        await percySnapshot(assert);
    });
});
