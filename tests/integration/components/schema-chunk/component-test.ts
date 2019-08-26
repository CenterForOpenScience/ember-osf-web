import { render } from '@ember/test-helpers';
import a11yAudit from 'ember-a11y-testing/test-support/audit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | schema-chunk', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    test('it renders page-heading', async function(assert) {
        await render(hbs`
            <Registries::SchemaChunk as |chunk| >
                <chunk.page-heading>Page Heading</chunk.page-heading>
            </Registries::SchemaChunk>
        `);
        assert.dom('[data-test-page-heading]').exists();
        assert.dom('[data-test-page-heading]').hasText('Page Heading');
        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
    });

    test('it renders section-heading', async function(assert) {
        await render(hbs`
            <Registries::SchemaChunk as |chunk| >
                <chunk.section-heading>Section Heading</chunk.section-heading>
            </Registries::SchemaChunk>
        `);
        assert.dom('[data-test-section-heading]').exists();
        assert.dom('[data-test-section-heading]').hasText('Section Heading');
        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
    });

    test('it renders subsection-heading', async function(assert) {
        await render(hbs`
            <Registries::SchemaChunk as |chunk| >
                <chunk.subsection-heading>Subsection Heading</chunk.subsection-heading>
            </Registries::SchemaChunk>
        `);
        assert.dom('[data-test-subsection-heading]').exists();
        assert.dom('[data-test-subsection-heading]').hasText('Subsection Heading');
        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
    });

    test('it renders subsection-heading', async function(assert) {
        await render(hbs`
            <Registries::SchemaChunk as |chunk| >
                <chunk.subsection-heading>Subsection Heading</chunk.subsection-heading>
            </Registries::SchemaChunk>
        `);
        assert.dom('[data-test-subsection-heading]').exists();
        assert.dom('[data-test-subsection-heading]').hasText('Subsection Heading');
        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
    });

    test('it renders paragraph', async function(assert) {
        await render(hbs`
            <Registries::SchemaChunk as |chunk| >
                <chunk.paragraph>Test paragraph filler information</chunk.paragraph>
            </Registries::SchemaChunk>
        `);
        assert.dom('[data-test-paragraph-section]').exists();
        assert.dom('[data-test-paragraph-section]').hasText('Test paragraph filler information');
        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
    });

    test('it renders label', async function(assert) {
        this.set('answerId', 'answer__id');
        await render(hbs`
            <Registries::SchemaChunk @answerId={{this.answerId}} as |chunk| >
                <chunk.label>Test label</chunk.label>
            </Registries::SchemaChunk>
        `);
        assert.dom('[data-test-question-label]').exists();
        assert.dom('[data-test-question-label]').hasText('Test label');
        assert.ok('[data-test-question-label]:[for="answer__id"]');
        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
    });

    test('it renders textbox', async function(assert) {
        this.set('answerId', 'answer__id');

        await render(hbs`
            <Registries::SchemaChunk
                @answerId={{this.answerId}}
                as |chunk|
            >
                <chunk.text />
            </Registries::SchemaChunk>
        `);
        assert.dom('[data-test-text-input]').exists();
        assert.ok('[data-test-text-input]:[valuePath="answer__id"]');
        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
    });

    test('it renders textarea', async function(assert) {
        this.set('answerId', 'answer__id');

        await render(hbs`
            <Registries::SchemaChunk
                @answerId={{this.answerId}}
                as |chunk|
            >
                <chunk.textarea />
            </Registries::SchemaChunk>
        `);
        assert.dom('[data-test-textarea-input]').exists();
        assert.dom('[data-test-textarea-input]:[valuePath="answer__id"]');
        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
    });
});
