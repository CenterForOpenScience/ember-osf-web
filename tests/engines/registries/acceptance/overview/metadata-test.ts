import { currentRouteName } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { currentURL, setupOSFApplicationTest, visit } from 'ember-osf-web/tests/helpers';
import { languageCodes } from 'ember-osf-web/utils/languages';
import { TestContext } from 'ember-test-helpers';


function languageFromCode(languageCode: string){
    const language = languageCodes.find(item => item.code === languageCode);
    if(language){
        return language.name;
    }
    return '';
}

module('Registries | Acceptance | overview/metadata', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('logged out', async function(this: TestContext, assert) {
        const node = server.create('registration', {
            id: 'mtadt',
            currentUserPermissions: [],
        });
        const url = `/${node.id}/metadata`;

        await visit(url);
        const metadataRecord = await this.owner.lookup('service:store')
            .findRecord('custom-item-metadata-record', node.id);
        assert.equal(currentURL(), url, `We are on ${url}`);
        assert.equal(currentRouteName(), 'registries.overview.metadata', 'We are at registries.overview.metadata');
        assert.dom('[data-test-display-resource-language]')
            .containsText(languageFromCode(metadataRecord.language), 'Language is correct');
        assert.dom('[data-test-display-resource-type-general]')
            .containsText(metadataRecord.resourceTypeGeneral, 'Resource type is correct');
        assert.dom('[data-test-display-node-description]')
            .containsText(node.description, 'Description is correct');
        for (const funder of metadataRecord.funders) {
            assert.dom(`[data-test-display-funder-name="${funder.funder_name}"]`)
                .containsText(funder.funder_name, `Funder name is correct for ${funder.funder_name}`);
            assert.dom(`[data-test-display-funder-award-title="${funder.funder_name}"]`)
                .containsText(funder.award_title, `Funder award title is correct for ${funder.funder_name}`);
            assert.dom(`[data-test-display-funder-award-uri="${funder.funder_name}"]`)
                .containsText(funder.award_uri,  `Funder award URI is correct for ${funder.funder_name}`);
            assert.dom(`[data-test-display-funder-award-number="${funder.funder_name}"`)
                .containsText(funder.award_number,  `Funder award number is correct for ${funder.funder_name}`);
        }
        assert.dom('[data-test-contributors-list]').exists();
        assert.dom('[data-test-subjects-list]').exists('There are subjects for registrations');

        assert.dom('[data-test-edit-node-description-button]').doesNotExist();
        assert.dom('[data-test-edit-resource-metadata-button]').doesNotExist();
        assert.dom('[data-test-edit-funding-metadata-button]').doesNotExist();
        assert.dom('[data-test-edit-contributors]').doesNotExist();
        await percySnapshot(assert);
    });
});
