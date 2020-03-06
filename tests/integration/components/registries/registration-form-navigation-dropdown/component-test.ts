import { click, render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | registration-form-navigation-dropdown', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    test('it renders only schema anchors and no metadata anchors by default', async function(assert) {
        server.loadFixtures('schema-blocks');
        server.loadFixtures('registration-schemas');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        this.set('schemaBlocks', registrationSchema.schemaBlocks);
        await render(hbs`
            <Registries::RegistrationFormNavigationDropdown
                @schemaBlocks={{this.schemaBlocks}}
            />
        `);
        await click('[data-test-toggle-anchor-nav-button]');
        assert.dom('[data-test-page-anchor="Metadata"]').doesNotExist();
        assert.dom('[data-test-page-anchor="title"').doesNotExist();
        assert.dom('[data-test-page-anchor="license"]').doesNotExist();
        assert.dom('[data-test-page-anchor="SB1"]').exists();
        assert.dom('[data-test-page-anchor="SB4"]').isVisible();
        assert.dom('.page-heading').exists({ count: 2 });
        assert.dom('li.question-label').exists({ count: 7 });
    });

    test('it renders schema and metadata anchors with showMetadata flag', async function(assert) {
        server.loadFixtures('schema-blocks');
        server.loadFixtures('registration-schemas');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        this.set('schemaBlocks', registrationSchema.schemaBlocks);
        await render(hbs`
            <Registries::RegistrationFormNavigationDropdown
                @schemaBlocks={{this.schemaBlocks}}
                @showMetadata={{true}}
            />
        `);
        await click('[data-test-toggle-anchor-nav-button]');
        assert.dom('[data-test-page-anchor="Metadata"]').exists();
        assert.dom('[data-test-page-anchor="title"]').exists();
        assert.dom('[data-test-page-anchor="license"]').exists();
        assert.dom('.page-heading > a[data-test-page-anchor="SB1"]').exists();
        assert.dom('.question-label > a[data-test-page-anchor="SB4"]').exists();
        assert.dom('.page-heading').exists({ count: 3 });
        assert.dom('li .question-label').exists({ count: 15 });
    });
});
