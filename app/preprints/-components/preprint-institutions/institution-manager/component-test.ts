import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest} from 'ember-qunit';
import { module, test } from 'qunit';
import { setupIntl } from 'ember-intl/test-support';
import PreprintModel from 'ember-osf-web/models/preprint';
import { ModelInstance } from 'ember-cli-mirage';
import PreprintProvider from 'ember-osf-web/models/preprint-provider';


module('Integration | Preprint | Component | Institution Manager', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    test('it renders with 4 user institutions and 1 affiliated preprint institution', async function(assert) {
        // Given the providers are loaded
        server.loadFixtures('preprint-providers');
        const store = this.owner.lookup('service:store');
        const osf = server.schema.preprintProviders.find('osf') as ModelInstance<PreprintProvider>;

        // And create a preprint with affiliated institutions
        const preprintMock = server.create('preprint', { provider: osf }, 'withAffiliatedInstitutions');

        // And retrieve the preprint from the store
        const preprint: PreprintModel = await store.findRecord('preprint', preprintMock.id);

        // And create a user for the service with institutions
        const user = server.create('user', { id: 'institution-user' }, 'withInstitutions');

        // And find the osf institutions from the preprint
        const institution = server.schema.institutions.find('osf');
        // And update the user with the union
        user.institutions.models.push(institution);
        user.save();

        // And find and set the user for the service
        const currentUserModel = await store.findRecord('user', 'institution-user');

        this.owner.lookup('service:current-user').setProperties({
            testUser: currentUserModel, currentUserId: currentUserModel.id,
        });

        // And bind the preprint to the test
        this.set('preprintMock', preprint);

        // When the component is rendered
        await render(hbs`
<Preprints::-Components::PreprintInstitutions::InstitutionManager
        @preprint={{this.preprintMock}} as |manager|>
    <Preprints::-Components::PreprintInstitutions::InstitutionSelectList
                @manager={{manager}} />
</Preprints::-Components::PreprintInstitutions::InstitutionManager> `);

        // Then the first attribute is verified by name and selected
        assert.dom('[data-test-institution-name="0"]').hasText('Main OSF Test Institution');
        assert.dom('[data-test-institution-input="0"]').isChecked();

        // And the other institutions are verified as not selected
        assert.dom('[data-test-institution-input="1"]').isNotChecked();
        assert.dom('[data-test-institution-input="2"]').isNotChecked();
        assert.dom('[data-test-institution-input="3"]').isNotChecked();
        assert.dom('[data-test-institution-input="4"]').doesNotExist();
    });
});
