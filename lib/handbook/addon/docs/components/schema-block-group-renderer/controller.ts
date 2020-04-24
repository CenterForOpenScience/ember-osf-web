import Changeset from 'ember-changeset';

import Controller from '@ember/controller';

import config from 'ember-get-config';
import { getSchemaBlockGroups, SchemaBlock } from 'ember-osf-web/packages/registration-schema';

const { OSF: { url } } = config;

export default class SchemaBlockGroupRendererController extends Controller {
    schemaBlocks: SchemaBlock[] = [
        {
            blockType: 'page-heading',
            displayText: 'Page heading',
            helpText: 'This is a helptext for page heading',
            index: 0,
        },
        {
            blockType: 'section-heading',
            displayText: 'First section',
            helpText: 'This is a helptext for section heading',
            index: 1,
        },
        {
            blockType: 'subsection-heading',
            displayText: 'Subsection',
            helpText: 'This is a helptext for subsection heading',
            index: 2,
        },
        {
            blockType: 'question-label',
            displayText: 'What do cats like more?',
            exampleText: `This is the example text.
            The "show example" button above should only appear
            if the form is editable and exampleText is not an empty string for a question label block`,
            helpText: 'This is a helptext for question label',
            schemaBlockGroupKey: 'q1',
            index: 3,
        },
        {
            blockType: 'single-select-input',
            registrationResponseKey: 'page-one_single-select',
            helpText: 'This is a helptext for single select input',
            schemaBlockGroupKey: 'q1',
            index: 4,
        },
        {
            blockType: 'select-input-option',
            displayText: 'tuna',
            helpText: 'This is a helptext for single select option 1',
            schemaBlockGroupKey: 'q1',
            index: 5,
        },
        {
            blockType: 'select-input-option',
            displayText: 'chicken',
            helpText: 'This is a helptext for single select option 2',
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
            helpText: 'This is the help text for short text input',
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
            helpText: 'This is the help text for a long text input',
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
            helpText: 'This is the help text for a multi select input',
            schemaBlockGroupKey: 'q4',
            index: 12,
        },
        {
            blockType: 'select-input-option',
            displayText: 'Nickelback',
            helpText: 'This is the help text for single select option 1',
            schemaBlockGroupKey: 'q4',
            index: 13,
        },
        {
            blockType: 'select-input-option',
            displayText: 'Crocs',
            helpText: 'This is the help text for single select option 2',
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
            index: 17,
        },
        {
            blockType: 'single-select-input',
            registrationResponseKey: 'page-one_single-select-two',
            schemaBlockGroupKey: 'q5',
            index: 18,
        },
        {
            blockType: 'select-input-option',
            displayText: 'Always be on the proper beat while doing the macarena',
            schemaBlockGroupKey: 'q5',
            index: 19,
        },
        {
            blockType: 'select-input-option',
            displayText: 'Remember who was in NSync and who was in Backstreet Boys',
            schemaBlockGroupKey: 'q5',
            index: 20,
        },
        {
            blockType: 'select-other-option',
            displayText: 'Other',
            schemaBlockGroupKey: 'q5',
            index: 21,
        },
        {
            blockType: 'question-label',
            displayText: 'Contributors:',
            schemaBlockGroupKey: 'q6',
            index: 22,
        },
        {
            blockType: 'contributors-input',
            registrationResponseKey: 'page-one_contributors-input',
            helpText: 'This is the help text for read only contributor list',
            schemaBlockGroupKey: 'q6',
            index: 23,
        },
        {
            blockType: 'paragraph',
            displayText: 'This is a paragraph.',
            helpText: 'This is a helptext for paragraph',
            index: 24,
        },
        {
            blockType: 'question-label',
            displayText: 'Files:',
            schemaBlockGroupKey: 'q7',
            index: 25,
        },
        {
            blockType: 'file-input',
            registrationResponseKey: 'page-one_file-input',
            schemaBlockGroupKey: 'q7',
            index: 26,
        },
    ];

    schemaBlockGroups = getSchemaBlockGroups(this.schemaBlocks);

    registrationResponse = {
        'page-one_single-select': '',
        'page-one_short-text': '',
        'page-one_long-text': '',
        'page-one_multi-select': [],
        'page-one_single-select-two': '',
        'page-one_file-input': [],
    };

    registrationResponseChangeset = new Changeset(this.registrationResponse);

    registrationResponses = {
        'page-one_single-select': 'tuna',
        'page-one_short-text': 'Suicune',
        'page-one_long-text': 'One is called a marsh, and one is called a swamp',
        'page-one_multi-select': ['crocs', 'Nickelback'],
        'page-one_single-select-two': 'Remember who was in NSync and who was in Backstreet Boys',
        'page-one_file-input': [
            {
                file_id: 'ad552',
                file_name: 'connecting_home_loan_account.mpe',
                file_urls: {
                    html: `${url}files/osfstorage/ad552/`,
                    download: `${url}files/osfstorage/ad552`,
                },
                file_hashes: {
                    sha256: 'be5fa974179240abad6772d850bd6e86',
                },
            },
            {
                file_id: 'gu5d4',
                file_name: 'auto_loan_account.mp4',
                file_urls: {
                    html: `${url}files/osfstorage/gu4d5`,
                    download: `${url}/files/osfstorage/gu4d5`,
                },
                file_hashes: {
                    sha256: 'be5fa974179240abad6772d850bd6e86',
                },
            },
        ],
    };
}
