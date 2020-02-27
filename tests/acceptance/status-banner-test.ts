import { visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import config from 'ember-get-config';
import { t } from 'ember-intl/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';
import stripHtmlTags from 'ember-osf-web/tests/helpers/strip-html-tags';

const {
    OSF: {
        cookies: {
            status: statusCookie,
        },
    },
} = config;

module('Acceptance | Status Banner', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('welcome message shows correctly', async assert => {
        server.create('user', 'loggedIn');

        /* eslint-disable-next-line max-len */
        document.cookie = `${statusCookie}=[{"id": "welcome_message", "class": "default", "jumbo": true, "dismiss": true, "extra": {}}]; path=/;`;
        await visit('/');

        assert.dom('[data-test-status-message="status.welcome_message"]')
            .hasText(stripHtmlTags(t('status.welcome_message').toString()));

        await percySnapshot(assert);
    });
});
