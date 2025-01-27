import { click } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { ModelInstance } from 'ember-cli-mirage';

import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';
import PreprintModel from 'ember-osf-web/models/preprint';
import { ReviewsState } from 'ember-osf-web/models/provider';
import { OsfLinkRouterStub } from 'ember-osf-web/tests/integration/helpers/osf-link-router-stub';

module('Integration | Component | preprint-doi', function(hooks) {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    test('it renders', async function(assert) {
        this.owner.unregister('service:router');
        this.owner.register('service:router', OsfLinkRouterStub);
        this.store = this.owner.lookup('service:store');
        server.loadFixtures('preprint-providers');
        const mirageProvider = server.schema.preprintProviders.find('osf') as ModelInstance<PreprintProviderModel>;
        const miragePreprint = server.create('preprint', {
            id: 'doied',
            provider: mirageProvider,
        }, 'withVersions');
        // Version 1 has a DOI and has a preprintDoiCreated date
        const version1 = server.schema.preprints.find('doied_v1') as ModelInstance<PreprintModel>;
        version1.update({ preprintDoiCreated: new Date('2020-02-02') });
        // Version 2 has a DOI but no preprintDoiCreated date
        const version2 = server.schema.preprints.find('doied_v2') as ModelInstance<PreprintModel>;
        version2.update({ preprintDoiCreated: null });
        // Version 3 is pending moderator approval and is not published, therefore has no DOI
        const version3 = server.schema.preprints.find('doied_v3') as ModelInstance<PreprintModel>;
        version3.update({
            preprintDoiCreated: null,
            isPublished: false,
            isPreprintDoi: false, // Mirage flag used to determine if a DOI should be created
        });

        const preprint = await this.store.findRecord('preprint', miragePreprint.id);
        const versions = await preprint.queryHasMany('versions');

        const provider = await this.store.findRecord('preprint-provider', mirageProvider.id);
        this.set('versions', versions);
        this.set('currentVersion', versions[1]);
        this.set('provider', provider);

        await render(hbs`
<Preprints::-Components::PreprintDoi
    @currentVersion={{this.currentVersion}}
    @versions={{this.versions}}
    @provider={{this.provider}}
/>
        `);

        // check headings exist
        assert.dom('[data-test-preprint-doi-heading]').exists('Preprint DOI heading exists');
        assert.dom('[data-test-preprint-doi-heading]').hasText('Preprint DOI', 'Preprint DOI heading has correct text');

        // check dropdown exists
        assert.dom('[data-test-version-select-dropdown]').exists('Version select dropdown exists');
        assert.dom('[data-test-version-select-dropdown]')
            .hasText('Version 2 (Rejected)', 'Dropdown has passed in currentVersiom selected by default');
        assert.dom('[data-test-preprint-version="2"]').exists('Version 2 is shown');

        assert.dom('[data-test-view-version-link]').exists('View in OSF button exists');
        assert.dom('[data-test-view-version-link]').hasText('View version 2', 'View version link has correct text');

        // check version2 has DOI text
        assert.dom('[data-test-no-doi-text]').doesNotExist('No DOI text does not exist');
        assert.dom('[data-test-unlinked-doi-url]').exists('Preprint DOI URL exists');
        assert.dom('[data-test-unlinked-doi-description]').exists('Preprint DOI description exists');
        assert.dom('[data-test-unlinked-doi-description]')
            // eslint-disable-next-line max-len
            .hasText('DOIs are minted by a third party, and may take up to 24 hours to be registered.', 'Description is correct');

        // check version3 has DOI, but no preprintDoiCreated date
        await click('[data-test-version-select-dropdown]');
        await click('[data-test-preprint-version="3"]');
        assert.dom('[data-test-unlinked-doi-url]').doesNotExist('Unlinked preprint DOI URL does not exist');
        assert.dom('[data-test-no-doi-text]').exists('No DOI text exists');
        assert.dom('[data-test-no-doi-text]').hasText('DOI created after moderator approval', 'No DOI text is correct');

        // check version1 has DOI and preprintDoiCreated date
        await click('[data-test-version-select-dropdown]');
        await click('[data-test-preprint-version="1"]');
        assert.dom('[data-test-unlinked-doi-url]').doesNotExist('Unlinked preprint DOI URL does not exist');
        assert.dom('[data-test-unlinked-doi-description]').doesNotExist('Unlinked description does not exist');
        assert.dom('[data-test-linked-doi-url]').exists('Preprint DOI URL exists');
    });

    test('it renders statuses', async function(assert) {
        this.owner.unregister('service:router');
        this.owner.register('service:router', OsfLinkRouterStub);
        this.store = this.owner.lookup('service:store');
        server.loadFixtures('preprint-providers');
        const mirageProvider = server.schema.preprintProviders.find('osf') as ModelInstance<PreprintProviderModel>;
        const miragePreprint = server.create('preprint', {
            id: 'doied',
            provider: mirageProvider,
        }, 'withVersions');
        const version1 = server.schema.preprints.find('doied_v1') as ModelInstance<PreprintModel>;
        version1.update({ reviewsState: ReviewsState.ACCEPTED });
        const version2 = server.schema.preprints.find('doied_v2') as ModelInstance<PreprintModel>;
        version2.update({ reviewsState: ReviewsState.PENDING });
        const version3 = server.schema.preprints.find('doied_v3') as ModelInstance<PreprintModel>;
        version3.update({ reviewsState: ReviewsState.WITHDRAWN });

        const preprint = await this.store.findRecord('preprint', miragePreprint.id);
        const versions = await preprint.queryHasMany('versions');

        const provider = await this.store.findRecord('preprint-provider', mirageProvider.id);
        this.set('currentVersion', versions[0]);
        this.set('versions', versions);
        this.set('provider', provider);

        await render(hbs`
<Preprints::-Components::PreprintDoi
    @currentVersion={{this.currentVersion}}
    @versions={{this.versions}}
    @provider={{this.provider}}
/>
        `);

        await click('[data-test-version-select-dropdown]');
        assert.dom('[data-test-preprint-version="1"]').exists('Version 1 exists');
        assert.dom('[data-test-preprint-version="1"]').hasText('Version 1', 'Version 1 is accepted');
        assert.dom('[data-test-preprint-version="2"]').exists('Version 2 exists');
        assert.dom('[data-test-preprint-version="2"]').hasText('Version 2 (Pending)', 'Version 2 is pending');
        assert.dom('[data-test-preprint-version="3"]').exists('Version 3 exists');
        assert.dom('[data-test-preprint-version="3"]').hasText('Version 3 (Withdrawn)', 'Version 3 is withdrawn');
    });
});
