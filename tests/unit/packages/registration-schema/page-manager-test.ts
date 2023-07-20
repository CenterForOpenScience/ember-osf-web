import { PageManager, SchemaBlock } from 'ember-osf-web/packages/registration-schema';
import { module, test } from 'qunit';

module('Unit | Packages | registration-schema | page-manager', () => {
    test('page-manager constructor', function(assert) {
        const schemaBlocks = [
            {
                id: 'SB1',
                blockType: 'page-heading',
                displayText: 'First page of Test Schema',
                index: 0,
            },
            {
                id: 'SB2',
                blockType: 'section-heading',
                displayText: 'First section',
                index: 1,
            },
            {
                id: 'SB3',
                blockType: 'subsection-heading',
                displayText: 'Subsection',
                index: 2,
            },
            {
                id: 'SB4',
                blockType: 'question-label',
                displayText: 'What do cats like more?',
                schemaBlockGroupKey: 'q1',
                index: 3,
            },
            {
                id: 'SB5',
                blockType: 'single-select-input',
                registrationResponseKey: 'page-one_single-select',
                schemaBlockGroupKey: 'q1',
                index: 4,
            },
            {
                id: 'SB6',
                blockType: 'select-input-option',
                displayText: 'tuna',
                schemaBlockGroupKey: 'q1',
                index: 5,
            },
            {
                id: 'SB7',
                blockType: 'select-input-option',
                displayText: 'chicken',
                schemaBlockGroupKey: 'q1',
                index: 6,
            },
            {
                id: 'SB8',
                blockType: 'question-label',
                displayText: 'Which Pokemon is your favorite?',
                schemaBlockGroupKey: 'q2',
                index: 7,
            },
            {
                id: 'SB9',
                blockType: 'short-text-input',
                registrationResponseKey: 'page-one_short-text',
                schemaBlockGroupKey: 'q2',
                index: 8,
            },
            {
                id: 'SB10',
                blockType: 'question-label',
                displayText: 'What is the difference between a swamp and a marsh?',
                schemaBlockGroupKey: 'q3',
                index: 9,
            },
            {
                id: 'SB11',
                blockType: 'long-text-input',
                registrationResponseKey: 'page-one_long-text',
                schemaBlockGroupKey: 'q3',
                index: 10,
            },
            {
                id: 'SB12',
                blockType: 'question-label',
                displayText: 'I never understood all the hate for:',
                schemaBlockGroupKey: 'q4',
                index: 11,
            },
            {
                id: 'SB13',
                blockType: 'multi-select-input',
                registrationResponseKey: 'page-one_multi-select',
                schemaBlockGroupKey: 'q4',
                index: 12,
            },
            {
                id: 'SB14',
                blockType: 'select-input-option',
                displayText: 'Nickelback',
                schemaBlockGroupKey: 'q4',
                index: 13,
            },
            {
                id: 'SB15',
                blockType: 'select-input-option',
                displayText: 'Crocs',
                schemaBlockGroupKey: 'q4',
                index: 14,
            },
            {
                id: 'SB16',
                blockType: 'select-other-option',
                displayText: 'Other:',
                schemaBlockGroupKey: 'q4',
                index: 15,
            },
        ] as SchemaBlock[];
        const registrationResponses = {
            'page-one_single-select': 'Yes or YES!',
            'page-one_short-text': 'Feel Special',
            'page-one_long-text': 'Fancy',
            'page-one_multi-select': ['Rocket punch', 'BIM BAM BUM'],
        };
        const pageManager = new PageManager(schemaBlocks, registrationResponses);
        // Make sure the pageManager's page heading matches the page heading block's displayText
        assert.equal(pageManager.pageHeadingText, schemaBlocks[0].displayText);
        // Make sure the pageManager's changeset is property initiated
        assert.equal(pageManager.changeset!.get('page-one_single-select'),
            registrationResponses['page-one_single-select']);
        assert.equal(pageManager.changeset!.get('page-one_short-text'),
            registrationResponses['page-one_short-text']);
        assert.equal(pageManager.changeset!.get('page-one_long-text'),
            registrationResponses['page-one_long-text']);
        assert.deepEqual(pageManager.changeset!.get('page-one_multi-select'),
            registrationResponses['page-one_multi-select']);
    });
});
