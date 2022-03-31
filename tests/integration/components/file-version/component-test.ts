import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupIntl, t } from 'ember-intl/test-support';
import { percySnapshot } from 'ember-percy';
import { setupRenderingTest } from 'ember-qunit';
import moment from 'moment';
import { module, test } from 'qunit';
import sinon from 'sinon';

import { click } from 'ember-osf-web/tests/helpers';

module('Integration | Component | file-version', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    const changeVersionStub = sinon.stub();
    const downloadUrl = 'https://download.com';
    const date = '2020-02-02T02:02:02.000Z';
    test('it renders', async function(assert) {
        const version = {
            id: '1',
            attributes: {
                extra: {
                    downloads: 22,
                    hashes: {
                        md5: '1234md5',
                        sha256: '543sha21',
                    },
                    user: {
                        name: 'Larry',
                        url: '/larry',
                    },
                },
                version: 1,
                modified: new Date(date),
                modified_utc: new Date(date),
                versionIdentifier: 'version',
            },
        };
        this.setProperties({
            version,
            changeVersion: changeVersionStub,
            downloadUrl,
        });

        await render(hbs`
        <FileVersion
            @version={{this.version}} @downloadUrl={{this.downloadUrl}} @changeVersion={{this.changeVersion}}
        />
        `);
        assert.dom('[data-test-file-version-date]').hasText(moment(date).format('YYYY-MM-DD hh:mm A'));
        assert.dom('[data-test-file-version-toggle-button] .fa-caret-down').exists('toggle button points down');
        assert.dom('[data-test-file-version-section]').doesNotExist('No sections shown');

        await click('[data-test-file-version-toggle-button]');
        assert.dom('[data-test-file-version-toggle-button] .fa-caret-up').exists('toggle button points up');
        assert.dom('[data-test-file-version-section="md5"]')
            .hasText(t('osf-components.file-version.copy_md5'));
        assert.dom('[data-test-file-version-section="sha2"]')
            .hasText(t('osf-components.file-version.copy_sha2'));
        assert.dom('[data-test-file-version-section="download"]')
            .containsText(t('general.download'));
        assert.dom('[data-test-file-version-section="download"]')
            .containsText('22', 'shows download count');
        await percySnapshot(assert);
    });
});
