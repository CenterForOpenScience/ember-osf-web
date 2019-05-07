import { currentURL, fillIn, visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';
import { CurrentUserStub } from 'ember-osf-web/tests/helpers/require-auth';

module('Acceptance | settings | profile | name', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('cannot use unauthenticated', async function(assert) {
        this.owner.register('service:current-user', CurrentUserStub);
        const currentUser = this.owner.lookup('service:current-user');
        await visit('/settings/profile/name');
        assert.equal(currentUser.urlCalled, '/settings/profile/name');
    });

    test('visit settings page for basic functionality', async assert => {
        const currentUser = server.create('user', 'loggedIn');
        await visit('/settings/profile/name');

        assert.equal(currentURL(), '/settings/profile/name', 'Stayed on the proper url.');
        assert.dom('[data-test-full-name-field] input[type=text]').hasValue(currentUser.fullName);
        assert.dom('[data-test-given-name-field] input[type=text]').hasValue(currentUser.givenName);
        assert.dom('[data-test-middle-names-field] input[type=text]').hasValue(currentUser.middleNames);
        assert.dom('[data-test-family-name-field] input[type=text]').hasValue(currentUser.familyName);
        assert.dom('[data-test-suffix-field] input[type=text]').hasValue(currentUser.suffix);
        assert.dom('[data-test-discard-changes')
            .isDisabled('No changes means you cannot discard changes.');
        assert.dom('[data-test-citation-container]').exists();
    });

    test('citation preview works properly', async assert => {
        const user = server.create(
            'user',
            {
                givenName: 'Peggy',
                middleNames: 'Herbert Gavin',
                familyName: 'Doyle',
                suffix: 'DDS',
                fullName: 'Peggy Herbert Gavin Doyle, DDS.',
            },
            'loggedIn',
        );
        const apa = 'Doyle, P. H. G., DDS.';
        const mla = 'Doyle, Peggy H. G., DDS.';
        await visit('/settings/profile/name');
        assert.dom('[data-test-citation-container]').exists();
        assert.dom('[data-test-apa-citation]').containsText(apa);
        assert.dom('[data-test-mla-citation]').containsText(mla);
        await percySnapshot(assert);
        await fillIn('[data-test-given-name-field] input', '');
        assert.dom('[data-test-citation-container]').exists();
        assert.dom('[data-test-apa-citation]').containsText(apa);
        assert.dom('[data-test-mla-citation]').containsText(mla);
        await fillIn('[data-test-given-name-field] input', 'Peggy');
        assert.dom('[data-test-citation-container]').exists();
        assert.dom('[data-test-apa-citation]').containsText(apa);
        assert.dom('[data-test-mla-citation]').containsText(mla);
        await fillIn('[data-test-family-name-field] input', '');
        assert.dom('[data-test-citation-container]').exists();
        assert.dom('[data-test-apa-citation]').containsText(apa);
        assert.dom('[data-test-mla-citation]').containsText(mla);
        await fillIn('[data-test-given-name-field] input', '');
        assert.dom('[data-test-citation-container]').exists();
        assert.dom('[data-test-apa-citation]').containsText(apa);
        assert.dom('[data-test-mla-citation]').containsText(mla);
        await click('[data-test-discard-changes]');
        assert.dom('[data-test-discard-changes')
            .isDisabled('Already discarded changes means you cannot discard changes.');
        assert.dom('[data-test-citation-container]').exists();
        assert.dom('[data-test-apa-citation]').containsText(apa);
        assert.dom('[data-test-mla-citation]').containsText(mla);
        assert.dom('[data-test-given-name-field] input[type=text]').hasValue('Peggy');
        assert.dom('[data-test-family-name-field] input[type=text]').hasValue('Doyle');
        await fillIn('[data-test-given-name-field] input', 'Maggs');
        assert.dom('[data-test-given-name-field] input[type=text]').hasValue('Maggs');
        assert.dom('[data-test-citation-container]').exists();
        assert.dom('[data-test-apa-citation]').containsText(apa);
        assert.dom('[data-test-mla-citation]').containsText(mla);
        await click('[data-test-save]');
        assert.dom('[data-test-apa-citation]').containsText('Doyle, M. H. G., DDS.');
        assert.dom('[data-test-mla-citation]').containsText('Doyle, Maggs H. G., DDS.');
        assert.dom('[data-test-discard-changes')
            .isDisabled('Just saved means you cannot discard changes.');
        assert.equal(user.givenName, 'Maggs');
    });

    test('validation works', async assert => {
        const givenName = 'Peggy';
        const middleNames = 'Herbert Gavin';
        const familyName = 'Doyle';
        const suffix = 'DDS';
        const fullName = 'Peggy Herbert Gavin Doyle, DDS.';
        const user = server.create(
            'user',
            {
                givenName,
                middleNames,
                familyName,
                suffix,
                fullName,
            },
            'loggedIn',
        );
        const oneEightySeven = 'x'.repeat(187);
        const twoFiftySix = 'x'.repeat(256);

        await visit('/settings/profile/name');
        await fillIn('[data-test-full-name-field] input', oneEightySeven);
        await fillIn('[data-test-given-name-field] input', twoFiftySix);
        await fillIn('[data-test-middle-names-field] input', twoFiftySix);
        await fillIn('[data-test-family-name-field] input', twoFiftySix);
        await fillIn('[data-test-suffix-field] input', twoFiftySix);
        assert.dom('[data-test-full-name-field]')
            .doesNotContainText('This field is too long', 'No message before first save.');
        assert.dom('[data-test-given-name-field]')
            .doesNotContainText('This field is too long', 'No message before first save.');
        assert.dom('[data-test-middle-names-field]')
            .doesNotContainText('This field is too long', 'No message before first save.');
        assert.dom('[data-test-family-name-field]')
            .doesNotContainText('This field is too long', 'No message before first save.');
        assert.dom('[data-test-suffix-field]')
            .doesNotContainText('This field is too long', 'No message before first save.');
        await click('[data-test-save]');
        assert.dom('[data-test-full-name-field]').containsText('This field is too long');
        assert.dom('[data-test-given-name-field]').containsText('This field is too long');
        assert.dom('[data-test-middle-names-field]').containsText('This field is too long');
        assert.dom('[data-test-family-name-field]').containsText('This field is too long');
        assert.dom('[data-test-suffix-field]').containsText('This field is too long');
        await percySnapshot(assert);
        assert.equal(user.givenName, givenName, 'No change from invalid save.');
        assert.equal(user.middleNames, middleNames, 'No change from invalid save.');
        assert.equal(user.familyName, familyName, 'No change from invalid save.');
        assert.equal(user.suffix, suffix, 'No change from invalid save.');
        assert.equal(user.fullName, fullName, 'No change from invalid save.');
        await fillIn('[data-test-full-name-field] input', fullName);
        assert.dom('[data-test-full-name-field]').doesNotContainText('This field is too long');
        await fillIn('[data-test-given-name-field] input', givenName);
        assert.dom('[data-test-given-name-field]').doesNotContainText('This field is too long');
        await fillIn('[data-test-middle-names-field] input', middleNames);
        assert.dom('[data-test-middle-names-field]').doesNotContainText('This field is too long');
        await fillIn('[data-test-family-name-field] input', familyName);
        assert.dom('[data-test-family-name-field]').doesNotContainText('This field is too long');
        await fillIn('[data-test-suffix-field] input', suffix);
        assert.dom('[data-test-suffix-field]').doesNotContainText('This field is too long');
        await fillIn('[data-test-full-name-field] input', '');
        assert.dom('[data-test-full-name-field]').containsText('This field can\'t be blank');
        await fillIn('[data-test-full-name-field] input', '12');
        assert.dom('[data-test-full-name-field]').containsText('This field is too short');
        await fillIn('[data-test-full-name-field] input', 'And Peggy!');
        assert.dom('[data-test-full-name-field]').doesNotContainText('This field is too long');
        await click('[data-test-save]');
        assert.equal(user.fullName, 'And Peggy!', 'Full name was successfully changed');
        assert.dom('[data-test-discard-changes')
            .isDisabled('Just saved means you cannot discard changes.');
    });
});
