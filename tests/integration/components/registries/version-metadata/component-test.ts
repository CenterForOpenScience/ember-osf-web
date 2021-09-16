import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { t } from 'ember-intl/test-support';
import moment from 'moment';
import { module, test } from 'qunit';

import { setupIntl, TestContext } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';

module('Integration | Component | version-metadata', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    // TODO: Test registrations with 2 revisions, registration with 2 revisions with one selected
    test('it renders', async function(this: TestContext, assert) {
        const currentUser = server.create('user', { fullName: 'Lex Luthor' }, 'loggedIn');
        const registration = server.create('registration', {
            title: 'The Effect of Glasses and Spandex on an Individuals Recognizability',
            registrationResponses: { q1: 'Clark Kent' },
        });
        const revision = server.create('revision', {
            initiatedBy: currentUser,
            dateModified: new Date(),
            revisionJustification: 'This registration went into a phone booth',
            revisionResponses: { q1: 'Super Man' },
            registration,
            revisionNumber: 0,
        });
        this.set('revision', revision);
        await render(hbs`<Registries::VersionMetadata @revision={{this.revision}} />`);
        assert.dom('[data-test-version-metadata-title]').hasText(
            t('registries.overview.versionMetadata.originalTitle'), 'revision title is shown',
        );
        assert.dom('[data-test-version-metadata-date]').hasTextContaining(
            t('registries.overview.versionMetadata.originalDate', {
                date: moment(revision.dateModified).format('MMM DD, YYYY'),
            }), 'revision initiator is shown',
        );
        assert.dom('[data-test-version-metadata-reason]')
            .hasTextContaining(revision.revisionJustification, 'revision justification is shown');
    });
});
