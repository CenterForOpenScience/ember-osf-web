import { render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | DraftRegistrationManager', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
        server.loadFixtures('schema-blocks');
        server.loadFixtures('registration-schemas');
    });

    test('can validate registrationResponses on load: invalid', async function(this: TestContext, assert) {
        const registrationResponses = {
            'page-one_long-text': '',
            'page-one_multi-select': [],
            'page-one_multi-select-other': '',
            'page-one_short-text': null, // Required
            'page-one_single-select': 'tuna',
            'page-one_single-select-two': '',
        };
        const mirageDraftRegistration = server.create('draft-registration', {
            registrationSchema: server.schema.registrationSchemas.find('testSchema'),
            registrationResponses,
        });

        const draftRegistration = await this.store.findRecord(
            'draft-registration',
            mirageDraftRegistration.id,
            { include: 'branched_from' },
        );

        this.setProperties({ draftRegistration });

        await render(hbs`
            <Registries::DraftRegistrationManager
                @currentPage=0
                @draftRegistration={{this.draftRegistration}}
                @node={{this.draftRegistration.branchedFrom}}
                as |draftManager|
            >
                <div data-test-registration-responses-is-valid>
                    {{if draftManager.registrationResponsesIsValid 'true' 'false'}}
                </div>
                <div data-test-current-page-is-valid>
                    {{if draftManager.currentPageManager.pageIsValid 'true' 'false'}}
                </div>
            </Registries::DraftRegistrationManager>
        `);

        assert.dom('[data-test-current-page-is-valid]').hasText('false');
        assert.dom('[data-test-registration-responses-is-valid]').hasText('false');
    });

    test('can validate registrationResponses on load: valid', async function(this: TestContext, assert) {
        const registrationResponses = {
            'page-one_long-text': '',
            'page-one_multi-select': ['Crocs'],
            'page-one_multi-select-other': '',
            'page-one_short-text': 'Pikachu',
            'page-one_single-select': 'tuna',
            'page-one_single-select-two': '',
        };
        const mirageDraftRegistration = server.create('draft-registration', {
            registrationSchema: server.schema.registrationSchemas.find('testSchema'),
            registrationResponses,
        });
        const draftRegistration = await this.store.findRecord(
            'draft-registration',
            mirageDraftRegistration.id,
            { include: 'branched_from' },
        );

        this.setProperties({ draftRegistration });

        await render(hbs`
            <Registries::DraftRegistrationManager
                @currentPage=0
                @draftRegistration={{this.draftRegistration}}
                @node={{this.draftRegistration.branchedFrom}}
                as |draftManager|
            >
                <div data-test-registration-responses-is-valid>
                    {{if draftManager.registrationResponsesIsValid 'true' 'false'}}
                </div>
                <div data-test-current-page-is-valid>
                    {{if draftManager.currentPageManager.pageIsValid 'true' 'false'}}
                </div>
            </Registries::DraftRegistrationManager>
        `);

        assert.dom('[data-test-current-page-is-valid]').hasText('true');
        assert.dom('[data-test-registration-responses-is-valid]').hasText('true');
    });
});
