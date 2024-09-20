import { click, render} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest} from 'ember-qunit';
import { module, test } from 'qunit';
import { setupIntl } from 'ember-intl/test-support';


module('Integration | Preprint | Component | Institution Manager | Institution Select List', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(async function(this) {
        // Given the testing variables are instantiated

        this.set('toggleInstitution', []);


        // And the manager mock is created
        const managerMock = Object({
            institutions: [],
            isElementDisabled: false,
            toggleInstitution: (institution: any): void => {
                const toggleInstitution = this.get('toggleInstitution');
                toggleInstitution.push(institution);
                this.set('toggleInstitution', toggleInstitution);
            },
        });
        this.set('managerMock', managerMock);
    });

    test('it does not render component without institutions',
        async function(assert) {

            // Given the component is rendered
            await render(hbs`
<Preprints::-Components::PreprintInstitutions::InstitutionSelectList
    @manager={{this.managerMock}}
/>
            `);

            // Then the component is not displayed
            assert.dom('[data-test-affiliated-institution]').doesNotExist('The institution is displayed');
        });

    test('it renders the component with an institution enabled and selected',
        async function(assert) {
            // Give manager is set-up for testing
            const managerMock = this.get('managerMock');
            managerMock.institutions = [Object({
                id: 1,
                isSelected: true,
                name: 'The institution name',
            })];

            this.set('managerMock', managerMock);

            // When the component is rendered
            await render(hbs`
<Preprints::-Components::PreprintInstitutions::InstitutionSelectList
    @manager={{this.managerMock}}
/>
            `);

            // Then the component is displayed
            assert.dom('[data-test-affiliated-institution]').exists('The institution component is displayed');

            // And the label exists
            assert.dom('[data-test-affiliated-institutions-label]').hasText('Affiliated Institutions');

            // And the description exists
            // eslint-disable-next-line max-len
            assert.dom('[data-test-affiliated-institutions-description]').hasText('You can affiliate your with your institution if it is an OSF institutional member and has worked with the Center for Open Science to create a dedicated institutional OSF landing page.');

            // And the input is checked
            assert.dom('[data-test-institution-input="0"]').isChecked();

            // And the input is enabled
            assert.dom('[data-test-institution-input="0"]').isEnabled();

            // And the institution name is displayed
            assert.dom('[data-test-institution-name="0"]').hasText('The institution name');

            // Finally the institution is clicked
            await click('[data-test-institution-input="0"]');

            assert.deepEqual(this.get('toggleInstitution'), [
                {
                    id: 1,
                    isSelected: false,
                    name: 'The institution name',
                },
            ]);

        });

    test('it renders the component with an institution disabled and not selected',
        async function(assert) {
            // Give manager is set-up for testing
            const managerMock = this.get('managerMock');
            managerMock.isElementDisabled = true;
            managerMock.institutions = [Object({
                id: 1,
                isSelected: false,
                name: 'The institution name',
            })];
            this.set('managerMock', managerMock);

            // When the component is rendered
            await render(hbs`
<Preprints::-Components::PreprintInstitutions::InstitutionSelectList
    @manager={{this.managerMock}}
/>
            `);

            // Then the component is displayed
            assert.dom('[data-test-affiliated-institution]').exists('The institution component is displayed');

            // And the label exists
            assert.dom('[data-test-affiliated-institutions-label]').hasText('Affiliated Institutions');

            // And the description exists
            // eslint-disable-next-line max-len
            assert.dom('[data-test-affiliated-institutions-description]').hasText('You can affiliate your with your institution if it is an OSF institutional member and has worked with the Center for Open Science to create a dedicated institutional OSF landing page.');

            // And the input is checked
            assert.dom('[data-test-institution-input="0"]').isNotChecked();

            // And the input is enabled
            assert.dom('[data-test-institution-input="0"]').isDisabled();

            // And the institution name is displayed
            assert.dom('[data-test-institution-name="0"]').hasText('The institution name');

            assert.deepEqual(this.get('toggleInstitution'), [ ]);

        });
});
