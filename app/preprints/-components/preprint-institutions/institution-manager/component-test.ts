import { click, render} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest} from 'ember-qunit';
import { module, test } from 'qunit';
import { setupIntl } from 'ember-intl/test-support';
import PreprintModel from 'ember-osf-web/models/preprint';
import { ModelInstance } from 'ember-cli-mirage';
import PreprintProvider from 'ember-osf-web/models/preprint-provider';
import InstitutionModel from 'ember-osf-web/models/institution';
import { Permission } from 'ember-osf-web/models/osf-model';


module('Integration | Preprint | Component | Institution Manager', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(async function(this) {
        // Given the providers are loaded
        server.loadFixtures('preprint-providers');
        this.store = this.owner.lookup('service:store');
        const osf = server.schema.preprintProviders.find('osf') as ModelInstance<PreprintProvider>;

        // And create a preprint with affiliated institutions
        const preprintMock = server.create('preprint', { provider: osf }, 'withAffiliatedInstitutions');

        // And retrieve the preprint from the store
        const preprint: PreprintModel = await this.store.findRecord('preprint', preprintMock.id);

        // And create a user for the service with institutions
        const user = server.create('user', { id: 'institution-user' }, 'withInstitutions');

        // And find the osf institutions from the preprint
        const institution = server.schema.institutions.find('osf');
        // And update the user with the union
        user.institutions.models.push(institution);
        user.save();

        // And find and set the user for the service
        const currentUserModel = await this.store.findRecord('user', 'institution-user');

        this.owner.lookup('service:current-user').setProperties({
            testUser: currentUserModel, currentUserId: currentUserModel.id,
        });

        this.set('affiliatedInstitutions', []);

        const managerMock = Object({
            provider: {
                documentType: {
                    singular: 'Test Preprint Word',
                },
            },
            isEditFlow: true,
            preprint,
            resetAffiliatedInstitutions: (): void => {
                this.set('affiliatedInstitutions', []);
            },
            updateAffiliatedInstitution: (affiliatedIinstitution: InstitutionModel): void => {
                const affiliatedInstitutions = this.get('affiliatedInstitutions');
                if (managerMock.isInstitutionAffiliated(affiliatedIinstitution.id)) {
                    affiliatedInstitutions.removeObject(affiliatedIinstitution);
                } else {
                    affiliatedInstitutions.addObject(affiliatedIinstitution);
                }
                this.set('affiliatedInstitutions', affiliatedInstitutions);

            },
            isInstitutionAffiliated: (id: string): boolean => {
                const affiliatedInstitutions = this.get('affiliatedInstitutions');
                return affiliatedInstitutions.find((mockInstitution: any) => mockInstitution.id === id) !== undefined;

            },
        });
        this.set('managerMock', managerMock);
    });

    test('it renders the correct labels',
        async function(assert) {

            // Given the component is rendered
            await render(hbs`
<Preprints::-Components::PreprintInstitutions::InstitutionManager
        @manager={{this.managerMock}} as |manager|>
    <Preprints::-Components::PreprintInstitutions::InstitutionSelectList
                @manager={{manager}} />
</Preprints::-Components::PreprintInstitutions::InstitutionManager> `);

            // Then the first attribute is verified by name and selected
            assert.dom('[data-test-affiliated-institutions-label]').hasText('Affiliated Institutions');
            // eslint-disable-next-line max-len
            assert.dom('[data-test-affiliated-institutions-description]').hasText('You can affiliate your Test Preprint Word with your institution if it is an OSF institutional member and has worked with the Center for Open Science to create a dedicated institutional OSF landing page.');
        });

    test('it renders with 4 user institutions and 0 affiliated preprint institution - create flow',
        async function(assert) {
            const managerMock = this.get('managerMock');

            // And retrieve the preprint from the store
            const preprint: PreprintModel = await this.store.findRecord('preprint', managerMock.preprint.id);
            // And I remove the affiliated insitutios
            preprint.affiliatedInstitutions = [] as any;
            await preprint.save();
            // And I remove the affiliated insitutios
            managerMock.preprint.affiliatedInstitutions = [];
            await managerMock.preprint.save();

            await render(hbs`
<Preprints::-Components::PreprintInstitutions::InstitutionManager
        @manager={{this.managerMock}} as |manager|>
    <Preprints::-Components::PreprintInstitutions::InstitutionSelectList
                @manager={{manager}} />
</Preprints::-Components::PreprintInstitutions::InstitutionManager> `);

            // Then the first attribute is verified by name and selected
            assert.dom('[data-test-institution-name="0"]').hasText('Main OSF Test Institution');
            assert.dom('[data-test-institution-input="0"]').isChecked();

            // And the other institutions are verified as not selected
            assert.dom('[data-test-institution-input="1"]').isChecked();
            assert.dom('[data-test-institution-input="2"]').isChecked();
            assert.dom('[data-test-institution-input="3"]').isChecked();
            assert.dom('[data-test-institution-input="4"]').doesNotExist();
        });

    test('it renders with 4 user institutions and 1 affiliated preprint institution - edit flow',
        async function(assert) {
            // When the component is rendered
            const managerMock = this.get('managerMock');
            managerMock.isEditFlow = true;

            const affiliatedInstitutions = [] as any[];
            managerMock.preprint.affiliatedInstitutions.map((institution: InstitutionModel) => {
                if (institution.id === 'osf') {
                    affiliatedInstitutions.push(institution);
                }
            });

            managerMock.preprint.affiliatedInstitutions = affiliatedInstitutions;
            this.set('managerMock', managerMock);
            await render(hbs`
<Preprints::-Components::PreprintInstitutions::InstitutionManager
        @manager={{this.managerMock}} as |manager|>
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

    test('it removes affiliated preprint institution',
        async function(assert) {
            // Given the component is rendered
            await render(hbs`
<Preprints::-Components::PreprintInstitutions::InstitutionManager
        @manager={{this.managerMock}} as |manager|>
    <Preprints::-Components::PreprintInstitutions::InstitutionSelectList
                @manager={{manager}} />
</Preprints::-Components::PreprintInstitutions::InstitutionManager> `);

            // When I unclick the first affiliated preprint
            await click('[data-test-institution-input="0"]');

            // Then the first attribute is verified by name and unselected
            assert.dom('[data-test-institution-name="0"]').hasText('Main OSF Test Institution');
            assert.dom('[data-test-institution-input="0"]').isNotChecked();

            // And the other institutions are verified as not selected
            assert.dom('[data-test-institution-input="1"]').isNotChecked();
            assert.dom('[data-test-institution-input="2"]').isNotChecked();
            assert.dom('[data-test-institution-input="3"]').isNotChecked();
            assert.dom('[data-test-institution-input="4"]').doesNotExist();

            const affiliatedInstitutions = this.get('affiliatedInstitutions');

            affiliatedInstitutions.forEach((institution: InstitutionModel) => {
                assert.notEqual(institution.id, 'osf', 'The osf institution is found.');
            });
        });

    test('it adds affiliated preprint institution',
        async function(assert) {
            // Given the component is rendered
            await render(hbs`
<Preprints::-Components::PreprintInstitutions::InstitutionManager
        @manager={{this.managerMock}} as |manager|>
    <Preprints::-Components::PreprintInstitutions::InstitutionSelectList
                @manager={{manager}} />
</Preprints::-Components::PreprintInstitutions::InstitutionManager> `);

            // And I find the name of the component under test
            // eslint-disable-next-line max-len
            const secondAffiliatedInstitutionName = this.element.querySelector('[data-test-institution-name="1"]')?.textContent?.trim();

            // When I click the second affiliated preprint
            await click('[data-test-institution-input="1"]');


            // Then the first attribute is verified by name and unselected
            assert.dom('[data-test-institution-input="1"]').isChecked();

            // And the other institutions are verified as not selected
            assert.dom('[data-test-institution-input="0"]').isChecked();
            assert.dom('[data-test-institution-input="2"]').isNotChecked();
            assert.dom('[data-test-institution-input="3"]').isNotChecked();
            assert.dom('[data-test-institution-input="4"]').doesNotExist();

            const affiliatedInstitutions = this.get('affiliatedInstitutions');

            // Finally I determine if the second institutions is now affiliated
            let isInstitutionAffiliatedFound = false;
            affiliatedInstitutions.forEach((institution: InstitutionModel) => {
                if (institution.name === secondAffiliatedInstitutionName) {
                    isInstitutionAffiliatedFound = true;
                }
            });

            assert.true(isInstitutionAffiliatedFound, 'The second institution is now affiliated');
        });

    test('it renders with the institutions as disabled',
        async function(assert) {
            const managerMock = this.get('managerMock');
            managerMock.preprint.currentUserPermissions = [Permission.Write, Permission.Read];
            managerMock.isEditFlow = false;
            this.set('managerMock', managerMock);

            // When the component is rendered
            await render(hbs`
<Preprints::-Components::PreprintInstitutions::InstitutionManager
        @manager={{this.managerMock}} as |manager|>
    <Preprints::-Components::PreprintInstitutions::InstitutionSelectList
                @manager={{manager}} />
</Preprints::-Components::PreprintInstitutions::InstitutionManager> `);

            // Then the first attribute is verified by name and selected
            assert.dom('[data-test-institution-name="0"]').hasText('Main OSF Test Institution');
            assert.dom('[data-test-institution-input="0"]').isChecked();
            assert.dom('[data-test-institution-input="0"]').isDisabled();

            // And the other institutions are verified as not selected
            assert.dom('[data-test-institution-input="1"]').isNotChecked();
            assert.dom('[data-test-institution-input="1"]').isDisabled();
            assert.dom('[data-test-institution-input="2"]').isNotChecked();
            assert.dom('[data-test-institution-input="2"]').isDisabled();
            assert.dom('[data-test-institution-input="3"]').isNotChecked();
            assert.dom('[data-test-institution-input="3"]').isDisabled();
            assert.dom('[data-test-institution-input="4"]').doesNotExist();
        });
});
