import Changeset from 'ember-changeset';

import Controller from '@ember/controller';

import { getSchemaBlockGroups, SchemaBlock } from 'ember-osf-web/packages/registration-schema';

export default class SchemaBlockGroupRendererController extends Controller {
    schemaBlocks: SchemaBlock[] = [
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
            schemaBlockGroupKey: 'q6',
            index: 17,
        },
        {
            blockType: 'single-select-input',
            registrationResponseKey: 'page-one_single-select-two',
            schemaBlockGroupKey: 'q6',
            index: 18,
        },
        {
            blockType: 'select-input-option',
            displayText: 'Always be on the proper beat while doing the macarena',
            schemaBlockGroupKey: 'q6',
            index: 19,
        },
        {
            blockType: 'select-input-option',
            displayText: 'Remember who was in NSync and who was in Backstreet Boys',
            schemaBlockGroupKey: 'q6',
            index: 20,
        },
        {
            blockType: 'select-other-option',
            displayText: 'Other',
            schemaBlockGroupKey: 'q6',
            index: 21,
        },
        {
            blockType: 'question-label',
            displayText: 'Contributors:',
            schemaBlockGroupKey: 'q5',
            index: 22,
        },
        {
            blockType: 'contributors-input',
            registrationResponseKey: 'page-one_contributors-input',
            schemaBlockGroupKey: 'q5',
            index: 23,
        },
    ];

    schemaBlockGroups = getSchemaBlockGroups(this.schemaBlocks);

    pageResponse = {
        'page-one_single-select': '',
        'page-one_short-text': '',
        'page-one_long-text': '',
        'page-one_multi-select': [],
        'page-one_single-select-two': '',
    };
    pageResponseChangeset = new Changeset(this.pageResponse);

    registrationResponses = {
        'page-one_single-select': 'tuna',
        'page-one_short-text': 'Suicune',
        'page-one_long-text': 'One is called a marsh, and one is called a swamp',
        'page-one_multi-select': ['crocs', 'Nickelback'],
        'page-one_single-select-two': 'Remember who was in NSync and who was in Backstreet Boys',
    };
}
