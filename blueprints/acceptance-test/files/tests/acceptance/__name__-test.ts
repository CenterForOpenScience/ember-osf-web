import { currentURL, visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { module, test } from 'qunit';

import { setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

module('<%= friendlyTestName %>', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('visiting /<%= dasherizedModuleName %>', async assert => {
        await visit('/<%= dasherizedModuleName %>');

        assert.equal(currentURL(), '/<%= dasherizedModuleName %>');
    });
});
