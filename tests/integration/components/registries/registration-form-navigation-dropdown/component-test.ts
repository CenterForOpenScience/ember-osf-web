import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { TestContext } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | registration-form-navigation-dropdown', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(async function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
        server.loadFixtures('schema-blocks');
        server.loadFixtures('registration-schemas');
        server.loadFixtures('registration-providers');
        server.loadFixtures('licenses');
        const initiator = server.create('user', 'loggedIn');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const draftRegistration = server.create(
            'draft-registration',
            {
                registrationSchema,
                initiator,
            },
        );
        const dr = await this.store.findRecord('draft-registration', draftRegistration.id);
        const schema = await dr.registrationSchema;
        const schemaBlocks = await schema.loadAll('schemaBlocks');
        this.set('schemaBlocks', schemaBlocks);
    });

    test('it renders only schema anchors and no metadata anchors by default', async assert => {
        await render(hbs`
            <Registries::RegistrationFormNavigationDropdown
                @schemaBlocks={{this.schemaBlocks}}
            />
        `);
        assert.dom('[data-test-toggle-anchor-nav-button]').exists();
        await click('[data-test-toggle-anchor-nav-button]');
        assert.dom('[data-test-page-anchor="Metadata"]').doesNotExist();
        assert.dom('[data-test-page-anchor="title"').doesNotExist();
        assert.dom('[data-test-page-anchor="license"]').doesNotExist();
        assert.dom('[data-test-page-anchor="SB1"]').exists();
        assert.dom('[data-test-page-anchor="SB4"]').isVisible();
        assert.dom('[data-test-list-item="page-heading"]').exists({ count: 2 });
        assert.dom('[data-test-list-item="question-label"]').exists({ count: 5 });
    });

    test('it renders schema and metadata anchors with showMetadata flag', async assert => {
        await render(hbs`
            <Registries::RegistrationFormNavigationDropdown
                @schemaBlocks={{this.schemaBlocks}}
                @showMetadata={{true}}
            />
        `);
        assert.dom('[data-test-toggle-anchor-nav-button]').exists();
        await click('[data-test-toggle-anchor-nav-button]');
        assert.dom('[data-test-page-anchor="Metadata"]').exists();
        assert.dom('[data-test-page-anchor="title"]').exists();
        assert.dom('[data-test-page-anchor="license"]').exists();
        assert.dom('[data-test-page-anchor="SB1"]').exists();
        assert.dom('[data-test-page-anchor="SB4"]').exists();
        assert.dom('[data-test-list-item="page-heading"]').exists({ count: 3 });
        assert.dom('[data-test-list-item="question-label"]').exists({ count: 12 });
    });
});
