import { setupMirage } from 'ember-cli-mirage/test-support';
import { t } from 'ember-intl/test-support';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import DataverseFile from 'ember-osf-web/packages/files/dataverse-file';

module('Unit | Packages | files | dataverse-file', hooks => {
    setupTest(hooks);
    setupMirage(hooks);
    test('proper display names', async function(assert) {
        const mirageFilePublished = server.create('file');
        mirageFilePublished.extra.datasetVersion = 'latest-published';
        const publishedFile = await this.owner.lookup('service:store').findRecord('file', mirageFilePublished.id);
        const publishedDataverseFile = new DataverseFile(this.owner.lookup('service:current-user'), publishedFile);
        const publishedSuffix = t('osf-components.file-browser.provider-specific-data.dataverse.latest-published');
        assert.equal(publishedDataverseFile.displayName,
            publishedDataverseFile.name + ' ' + publishedSuffix,
            'Published dataverse file has correct display name');

        const mirageFileDraft = server.create('file');
        mirageFileDraft.extra.datasetVersion = 'latest';
        const draftFile = await this.owner.lookup('service:store').findRecord('file', mirageFileDraft.id);
        const draftDataverseFile = new DataverseFile(this.owner.lookup('service:current-user'), draftFile);
        const draftSuffix = t('osf-components.file-browser.provider-specific-data.dataverse.latest');
        assert.equal(draftDataverseFile.displayName,
            draftDataverseFile.name + ' ' + draftSuffix,
            'Draft dataverse file has correct display name');
    });
});
