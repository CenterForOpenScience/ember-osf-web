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

    test('it renders original', async function(this: TestContext, assert) {
        const registration = server.create('registration');
        this.set('registration', registration);
        this.set('revision', registration.originalResponse);
        await render(hbs`
        <Registries::VersionMetadata
            @registration={{this.registration}} @revision={{this.revision}}
        />`);
        assert.dom('[data-test-version-metadata-title]').hasText(
            t('registries.overview.versionMetadata.originalTitle'), 'title indicates original version',
        );
        assert.dom('[data-test-version-metadata-date]').hasTextContaining(
            t('registries.overview.versionMetadata.originalDate', {
                date: moment(registration.dateRegistered).format('MMM DD, YYYY'),
            }), 'Registration submission date is shown',
        );
        assert.dom('[data-test-version-metadata-reason]')
            .doesNotExist();
    });

    test('it renders subsequent revision', async function(this: TestContext, assert) {
        const registration = server.create('registration');
        const justification = 'this is why';
        const revision = server.create('schema-response', {
            registration,
            revisionJustification: justification,
        });
        this.set('registration', registration);
        this.set('revision', revision);
        await render(hbs`
        <Registries::VersionMetadata
            @registration={{this.registration}} @revision={{this.revision}}
        />`);
        assert.dom('[data-test-version-metadata-title]').hasText(
            t('registries.overview.versionMetadata.updateTitle'), 'title indicates updated version',
        );
        assert.dom('[data-test-version-metadata-date]').hasTextContaining(
            t('registries.overview.versionMetadata.date', {
                date: moment(revision.dateModified).format('MMM DD, YYYY'),
            }), 'revision modification date is shown',
        );
        assert.dom('[data-test-version-metadata-reason]').hasTextContaining(justification);
    });
});
