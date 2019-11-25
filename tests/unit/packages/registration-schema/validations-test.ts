import { buildValidation, SchemaBlockGroup } from 'ember-osf-web/packages/registration-schema';
import { module, test } from 'qunit';

module('Unit | Packages | registration-schema | validations', () => {
    test('validate text inputs', assert => {
        const groups: SchemaBlockGroup[] = [
            {
                labelBlock: {
                    blockType: 'section-heading',
                    displayText: 'Test for Text Inputs',
                    index: 0,
                },
                groupType: 'section-heading',
            },
            // Short Text Inputs
            {
                labelBlock: {
                    blockType: 'question-label',
                    displayText: 'Short Text: Required',
                    index: 1,
                    schemaBlockGroupKey: 'q1',
                },
                inputBlock: {
                    blockType: 'short-text-input',
                    index: 2,
                    schemaBlockGroupKey: 'q1',
                    registrationResponseKey: 'q1ShortTextRequired',
                    required: true,
                },
                schemaBlockGroupKey: 'q1',
                registrationResponseKey: 'q1ShortTextRequired',
                groupType: 'short-text-input',
            },
            {
                labelBlock: {
                    blockType: 'question-label',
                    displayText: 'Short Text: Optional',
                    index: 3,
                    schemaBlockGroupKey: 'q2',
                },
                inputBlock: {
                    blockType: 'short-text-input',
                    index: 4,
                    schemaBlockGroupKey: 'q2',
                    registrationResponseKey: 'q2ShortTextOptional',
                    required: false,
                },
                schemaBlockGroupKey: 'q2',
                registrationResponseKey: 'q2ShortTextOptional',
                groupType: 'short-text-input',
            },
            // Long Text Inputs
            {
                labelBlock: {
                    blockType: 'question-label',
                    displayText: 'Long Text: Required',
                    index: 5,
                    schemaBlockGroupKey: 'q3',
                },
                inputBlock: {
                    blockType: 'long-text-input',
                    index: 6,
                    schemaBlockGroupKey: 'q3',
                    registrationResponseKey: 'q3LongTextRequired',
                    required: true,
                },
                schemaBlockGroupKey: 'q3',
                registrationResponseKey: 'q3LongTextRequired',
                groupType: 'long-text-input',
            },
            {
                labelBlock: {
                    blockType: 'question-label',
                    displayText: 'Long Text: Optional',
                    index: 7,
                    schemaBlockGroupKey: 'q4',
                },
                inputBlock: {
                    blockType: 'long-text-input',
                    index: 8,
                    schemaBlockGroupKey: 'q4',
                    registrationResponseKey: 'q4LongTextOptional',
                    required: false,
                },
                schemaBlockGroupKey: 'q4',
                registrationResponseKey: 'q4LongTextOptional',
                groupType: 'long-text-input',
            },
        ];
        const result = buildValidation(groups);
        assert.equal(result[groups[1].registrationResponseKey!].length, 1,
            'has 1 validation for required short text input');
        assert.equal(result[groups[2].registrationResponseKey!].length, 0,
            'has 0 validations for optional short text input');
        assert.equal(result[groups[3].registrationResponseKey!].length, 1,
            'has 1 validation for required long text input');
        assert.equal(result[groups[4].registrationResponseKey!].length, 0,
            'has 0 validations for optional long text input');
    });

    // test('validate contributor inputs', assert => {
    //     const groups: SchemaBlockGroup[] = [
    //         {
    //             labelBlock: {
    //                 blockType: 'section-heading',
    //                 displayText: 'Test for Contributor Inputs',
    //                 index: 0,
    //             },
    //             groupType: 'section-heading',
    //         },
    //         {
    //             labelBlock: {
    //                 blockType: 'question-label',
    //                 displayText: 'Contributors: Required',
    //                 index: 1,
    //                 schemaBlockGroupKey: 'q1',
    //             },
    //             inputBlock: {
    //                 blockType: 'contributors-input',
    //                 index: 2,
    //                 schemaBlockGroupKey: 'q1',
    //                 registrationResponseKey: 'q1ContributorsRequired',
    //                 required: true,
    //             },
    //             schemaBlockGroupKey: 'q1',
    //             registrationResponseKey: 'q1ContributorsRequired',
    //             groupType: 'contributors-input',
    //         },
    //         {
    //             labelBlock: {
    //                 blockType: 'question-label',
    //                 displayText: 'Contributors: Optional',
    //                 index: 3,
    //                 schemaBlockGroupKey: 'q2',
    //             },
    //             inputBlock: {
    //                 blockType: 'contributors-input',
    //                 index: 4,
    //                 schemaBlockGroupKey: 'q2',
    //                 registrationResponseKey: 'q2ContributorsOptional',
    //                 required: false,
    //             },
    //             schemaBlockGroupKey: 'q2',
    //             registrationResponseKey: 'q2ContributorsOptional',
    //             groupType: 'contributors-input',
    //         },
    //     ];
    //     const result = buildValidation(groups);
    //     assert.equal(result[groups[1].registrationResponseKey!].length, 2,
    //         'has 2 validation for required contributor input');
    //     assert.equal(result[groups[2].registrationResponseKey!].length, 1,
    //         'has 1 validations for optional contributor input');
    // });

    test('validate file inputs', assert => {
        const groups: SchemaBlockGroup[] = [
            {
                labelBlock: {
                    blockType: 'section-heading',
                    displayText: 'Test for File Inputs',
                    index: 0,
                },
                groupType: 'section-heading',
            },
            {
                labelBlock: {
                    blockType: 'question-label',
                    displayText: 'File: Required',
                    index: 1,
                    schemaBlockGroupKey: 'q1',
                },
                inputBlock: {
                    blockType: 'file-input',
                    index: 2,
                    schemaBlockGroupKey: 'q1',
                    registrationResponseKey: 'q1FileRequired',
                    required: true,
                },
                schemaBlockGroupKey: 'q1',
                registrationResponseKey: 'q1FileRequired',
                groupType: 'file-input',
            },
            {
                labelBlock: {
                    blockType: 'question-label',
                    displayText: 'File: Optional',
                    index: 3,
                    schemaBlockGroupKey: 'q2',
                },
                inputBlock: {
                    blockType: 'file-input',
                    index: 4,
                    schemaBlockGroupKey: 'q2',
                    registrationResponseKey: 'q2FileOptional',
                    required: false,
                },
                schemaBlockGroupKey: 'q2',
                registrationResponseKey: 'q2FileOptional',
                groupType: 'file-input',
            },
        ];
        const result = buildValidation(groups);
        assert.equal(result[groups[1].registrationResponseKey!].length, 2,
            'has 2 validation for required file input');
        assert.equal(result[groups[2].registrationResponseKey!].length, 1,
            'has 1 validations for optional file input');
    });

    test('validate select inputs', assert => {
        const groups: SchemaBlockGroup[] = [
            {
                labelBlock: {
                    blockType: 'section-heading',
                    displayText: 'Test for Select Inputs',
                    index: 0,
                },
                groupType: 'section-heading',
            },
            // Single Select: Required
            {
                labelBlock: {
                    blockType: 'question-label',
                    displayText: 'Single Select: Required',
                    index: 1,
                    schemaBlockGroupKey: 'q1',
                },
                inputBlock: {
                    blockType: 'single-select-input',
                    index: 2,
                    schemaBlockGroupKey: 'q1',
                    registrationResponseKey: 'q1SingleSelectRequired',
                    required: true,
                },
                optionBlocks: [
                    {
                        blockType: 'select-input-option',
                        index: 3,
                        schemaBlockGroupKey: 'q1',
                        displayText: 'option1 required single select',
                    },
                    {
                        blockType: 'select-input-option',
                        index: 4,
                        schemaBlockGroupKey: 'q1',
                        displayText: 'option2 required single-select',
                    },
                ],
                schemaBlockGroupKey: 'q1',
                registrationResponseKey: 'q1SingleSelectRequired',
                groupType: 'single-select-input',
            },
            // Single Select: Optional
            {
                labelBlock: {
                    blockType: 'question-label',
                    displayText: 'Single Select: Optional',
                    index: 5,
                    schemaBlockGroupKey: 'q2',
                },
                inputBlock: {
                    blockType: 'single-select-input',
                    index: 6,
                    schemaBlockGroupKey: 'q2',
                    registrationResponseKey: 'q2SingleSelectOptional',
                    required: false,
                },
                optionBlocks: [
                    {
                        blockType: 'select-input-option',
                        index: 7,
                        schemaBlockGroupKey: 'q2',
                        displayText: 'option1 optional single-select',
                    },
                    {
                        blockType: 'select-input-option',
                        index: 8,
                        schemaBlockGroupKey: 'q2',
                        displayText: 'option2 optional single-select',
                    },
                ],
                schemaBlockGroupKey: 'q2',
                registrationResponseKey: 'q2SingleSelectOptional',
                groupType: 'single-select-input',
            },

            // Multiple Select: Required
            {
                labelBlock: {
                    blockType: 'question-label',
                    displayText: 'Multi Select: Required',
                    index: 9,
                    schemaBlockGroupKey: 'q3',
                },
                inputBlock: {
                    blockType: 'multi-select-input',
                    index: 9,
                    schemaBlockGroupKey: 'q3',
                    registrationResponseKey: 'q3MultiSelectRequired',
                    required: true,
                },
                optionBlocks: [
                    {
                        blockType: 'select-input-option',
                        index: 10,
                        schemaBlockGroupKey: 'q3',
                        displayText: 'option1 required multi select',
                    },
                    {
                        blockType: 'select-input-option',
                        index: 11,
                        schemaBlockGroupKey: 'q3',
                        displayText: 'option2 required multi-select',
                    },
                ],
                schemaBlockGroupKey: 'q3',
                registrationResponseKey: 'q3MultiSelectRequired',
                groupType: 'multi-select-input',
            },
            // Multi Select: Optional
            {
                labelBlock: {
                    blockType: 'question-label',
                    displayText: 'Multi Select: Optional',
                    index: 12,
                    schemaBlockGroupKey: 'q4',
                },
                inputBlock: {
                    blockType: 'multi-select-input',
                    index: 13,
                    schemaBlockGroupKey: 'q4',
                    registrationResponseKey: 'q4MultiSelectOptional',
                    required: false,
                },
                optionBlocks: [
                    {
                        blockType: 'select-input-option',
                        index: 14,
                        schemaBlockGroupKey: 'q4',
                        displayText: 'option1 optional multi-select',
                    },
                    {
                        blockType: 'select-input-option',
                        index: 15,
                        schemaBlockGroupKey: 'q4',
                        displayText: 'option2 optional multi-select',
                    },
                ],
                schemaBlockGroupKey: 'q4',
                registrationResponseKey: 'q4MultiSelectOptional',
                groupType: 'single-select-input',
            },
        ];
        const result = buildValidation(groups);
        assert.equal(result[groups[1].registrationResponseKey!].length, 1,
            'has 1 validation for required Single-Selector input');
        assert.equal(result[groups[2].registrationResponseKey!].length, 0,
            'has 0 validations for optional Single-Select input');
        assert.equal(result[groups[3].registrationResponseKey!].length, 1,
            'has 1 validation for required Multi-Select input');
        assert.equal(result[groups[4].registrationResponseKey!].length, 0,
            'has 0 validations for optional Multi-Select input');
    });
});
