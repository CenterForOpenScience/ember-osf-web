import Controller from '@ember/controller';

export default class SchemaBlockGroupRendererController extends Controller {
    schemaGroup = [
        {
            groupType: 'short-text-input',
            blocks: [
                {
                    id: 'SB8',
                    blockType: 'question-label',
                    displayText: 'Which Pokemon is your favorite?',
                    schemaBlockGroupKey: 'q1',
                    index: 1,
                },
                {
                    id: 'SB9',
                    blockType: 'short-text-input',
                    registrationResponseKey: 'page-one_short-text',
                    schemaBlockGroupKey: 'q1',
                    index: 2,
                },
            ],
        },
        {
            groupType: 'long-text-input',
            blocks: [
                {
                    id: 'SB10',
                    blockType: 'question-label',
                    displayText: 'What is the difference between a swamp and a marsh?',
                    schemaBlockGroupKey: 'q2',
                    index: 3,
                },
                {
                    id: 'SB11',
                    blockType: 'long-text-input',
                    registrationResponseKey: 'page-one_long-text',
                    schemaBlockGroupKey: 'q2',
                    index: 4,
                },
            ],
        },
        {
            groupType: 'single-select-input',
            blocks: [
                {
                    id: 'SB19',
                    blockType: 'question-label',
                    displayText: 'If I had a super power it would be:',
                    schemaBlockGroupKey: 'q3',
                    index: 5,
                },
                {
                    id: 'SB20',
                    blockType: 'single-select-input',
                    registrationResponseKey: 'page-one_single-select-two',
                    schemaBlockGroupKey: 'q3',
                    index: 6,
                },
            ],
            optionBlocks: [
                {
                    id: 'SB21',
                    blockType: 'select-input-option',
                    displayText: 'Always be on the proper beat while doing the macarena',
                    schemaBlockGroupKey: 'q3',
                    index: 7,
                },
                {
                    id: 'SB22',
                    blockType: 'select-input-option',
                    displayText: 'Remember who was in NSync and who was in Backstreet Boys',
                    schemaBlockGroupKey: 'q3',
                    index: 8,
                },
                {
                    id: 'SB23',
                    blockType: 'select-other-option',
                    displayText: 'Other',
                    schemaBlockGroupKey: 'q3',
                    index: 9,
                },
                {
                    id: 'SB24',
                    blockType: 'short-text-input',
                    schemaBlockGroupKey: 'q3',
                    index: 10,
                },
            ],
        },
        {
            groupType: 'multi-select-input',
            blocks: [
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
            ],
            optionBlocks: [
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
                {
                    id: 'SB17',
                    blockType: 'short-text-input',
                    registrationResponseKey: 'page-one_multi-select-other',
                    schemaBlockGroupKey: 'q5',
                    index: 16,
                },
            ],
        },
    ];
}
