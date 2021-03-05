import { render } from '@ember/test-helpers';
import Changeset from 'ember-changeset';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { getSchemaBlockGroups, SchemaBlock } from 'ember-osf-web/packages/registration-schema';

module('Integration | Component | schema-block-group-renderer', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    test('it renders a schema group', async function(assert) {
        this.store = this.owner.lookup('service:store');

        const schemaBlocks: SchemaBlock[] = [
            {
                blockType: 'page-heading',
                displayText: 'Page heading',
                index: 0,
            },
            {
                blockType: 'section-heading',
                displayText: 'First section',
                index: 1,
            },
            {
                blockType: 'subsection-heading',
                displayText: 'Subsection',
                index: 2,
            },
            {
                blockType: 'question-label',
                displayText: 'What do cats like more?',
                schemaBlockGroupKey: 'q1',
                index: 3,
            },
            {
                blockType: 'single-select-input',
                registrationResponseKey: 'page-one_single-select',
                schemaBlockGroupKey: 'q1',
                index: 4,
            },
            {
                blockType: 'select-input-option',
                displayText: 'tuna',
                schemaBlockGroupKey: 'q1',
                index: 5,
            },
            {
                blockType: 'select-input-option',
                displayText: 'chicken',
                schemaBlockGroupKey: 'q1',
                index: 6,
            },
            {
                blockType: 'question-label',
                displayText: 'Which Pokemon is your favorite?',
                schemaBlockGroupKey: 'q2',
                index: 7,
            },
            {
                blockType: 'short-text-input',
                registrationResponseKey: 'page-one_short-text',
                schemaBlockGroupKey: 'q2',
                index: 8,
            },
            {
                blockType: 'question-label',
                displayText: 'What is the difference between a swamp and a marsh?',
                schemaBlockGroupKey: 'q3',
                index: 9,
            },
            {
                blockType: 'long-text-input',
                registrationResponseKey: 'page-one_long-text',
                schemaBlockGroupKey: 'q3',
                index: 10,
            },
            {
                blockType: 'question-label',
                displayText: 'I never understood all the hate for:',
                schemaBlockGroupKey: 'q4',
                index: 11,
            },
            {
                blockType: 'multi-select-input',
                registrationResponseKey: 'page-one_multi-select',
                schemaBlockGroupKey: 'q4',
                index: 12,
            },
            {
                blockType: 'select-input-option',
                displayText: 'Nickelback',
                schemaBlockGroupKey: 'q4',
                index: 13,
            },
            {
                blockType: 'select-input-option',
                displayText: 'Crocs',
                schemaBlockGroupKey: 'q4',
                index: 14,
            },
            {
                blockType: 'select-other-option',
                displayText: 'Other:',
                schemaBlockGroupKey: 'q4',
                index: 15,
            },
            {
                blockType: 'question-label',
                displayText: 'If I had a super power it would be:',
                schemaBlockGroupKey: 'q5',
                index: 16,
            },
            {
                blockType: 'single-select-input',
                registrationResponseKey: 'page-one_single-select-two',
                schemaBlockGroupKey: 'q5',
                index: 17,
            },
            {
                blockType: 'select-input-option',
                displayText: 'Always be on the proper beat while doing the macarena',
                schemaBlockGroupKey: 'q5',
                index: 18,
            },
            {
                blockType: 'select-input-option',
                displayText: 'Remember who was in NSync and who was in Backstreet Boys',
                schemaBlockGroupKey: 'q5',
                index: 19,
            },
            {
                blockType: 'select-other-option',
                displayText: 'Other',
                schemaBlockGroupKey: 'q5',
                index: 20,
            },
            {
                blockType: 'question-label',
                displayText: 'Contributors:',
                schemaBlockGroupKey: 'q6',
                index: 21,
            },
            {
                blockType: 'contributors-input',
                registrationResponseKey: 'page-one_contributors-input',
                schemaBlockGroupKey: 'q6',
                index: 22,
            },
            {
                blockType: 'question-label',
                displayText: 'Files:',
                schemaBlockGroupKey: 'q7',
                index: 23,
            },
            {
                blockType: 'file-input',
                registrationResponseKey: 'page-one_file-input',
                schemaBlockGroupKey: 'q7',
                index: 24,
            },
        ];
        const schemaBlockGroups = getSchemaBlockGroups(schemaBlocks);
        const mirageNode = server.create('node', 'withFiles');
        const mirageDraftRegistration = server.create('draft-registration',
            { branchedFrom: mirageNode }, 'withFiles');
        const testFile = server.create('file', { target: mirageNode });
        const registrationResponse = {
            'page-one_short-text': '',
            'page-one_long-text': '',
            'page-one_single-select-two': '',
            'page-one_multi-select': [],
            'page-one_file-input': [testFile],
        };
        const registrationResponseChangeset = new Changeset(registrationResponse);
        const draftRegistration = await this.store.findRecord(
            'draft-registration',
            mirageDraftRegistration.id, {
                include: 'bibliographic_contributors',
                reload: true,
            },
        );

        this.set('draftRegistration', draftRegistration);
        this.set('schemaBlockGroups', schemaBlockGroups);
        this.set('pageResponseChangeset', registrationResponseChangeset);
        await render(hbs`
            {{#each this.schemaBlockGroups as |group|}}
                <Registries::SchemaBlockGroupRenderer
                    @schemaBlockGroup={{group}}
                    @renderStrategy={{
                        component
                        'registries/schema-block-renderer/editable/mapper'
                        changeset=this.pageResponseChangeset
                        draftRegistration=this.draftRegistration
                    }}
                />
            {{/each}}
        `);
        assert.dom('[data-test-page-heading]').exists();
        assert.dom('[data-test-section-heading]').exists();
        assert.dom('[data-test-subsection-heading]').exists();
        assert.dom('[data-test-question-label]').exists({ count: 7 });
        assert.dom('[data-test-radio-button-group]').exists({ count: 2 });
        assert.dom('[data-test-radio-input]').exists({ count: 4 });
        assert.dom('[data-test-text-input]').exists();
        assert.dom('[data-test-textarea-input]').exists();
        assert.dom('[data-test-multi-select-input]').exists();
        assert.dom('[data-test-read-only-contributors-list]').exists();
        assert.dom('[data-test-editable-file-widget]').exists();
        assert.dom('[data-test-selected-files]').exists();
        assert.dom(`[data-test-selected-file="${testFile.id}"]`).exists();
    });
});
