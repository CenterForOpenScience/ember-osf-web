import { getSchemaBlockGroup, SchemaBlock } from 'ember-osf-web/packages/registration-schema';
import { module, test } from 'qunit';

module('Unit | Packages | registration-schema | get-schema-block-group', () => {
    test('Group stand alone input as question group', assert => {
        const standAloneSchema: SchemaBlock[] = [
            {
                blockType: 'section-heading',
                displayText: 'Section in the First Page',
                index: 0,
            },
            {
                blockType: 'short-text-input',
                schemaBlockGroupKey: 'q1',
                registrationResponseKey: 'a1',
                index: 1,
            },
        ];
        const result = getSchemaBlockGroup(standAloneSchema, 'q1');
        assert.equal(result.registrationResponseKey, 'a1', 'has proper registrationResponseKey');
        assert.equal(result.schemaBlockGroupKey, 'q1', 'has proper schemaBlockGroupKey');
        assert.ok(!result.optionBlocks, 'has proper optionBlocks');
        assert.equal(result.inputType, result.inputBlock!.blockType,
            'group input type matches blockType of inputBlock');
    });

    test('Group multiple choice question as schema block group', assert => {
        const mulitSelectSchema: SchemaBlock[] = [
            {
                blockType: 'section-heading',
                displayText: 'Extraneous heading',
                index: 0,
            },
            {
                blockType: 'question-label',
                displayText: 'Multi Select',
                schemaBlockGroupKey: 'testMulti',
                index: 1,
            },
            {
                blockType: 'multi-select-input',
                schemaBlockGroupKey: 'testMulti',
                registrationResponseKey: 'testMultiAnswer',
                index: 2,
            },
            {
                blockType: 'select-input-option',
                schemaBlockGroupKey: 'testMulti',
                displayText: 'Multi-option 1',
                index: 3,
            },
            {
                blockType: 'select-input-option',
                schemaBlockGroupKey: 'testMulti',
                displayText: 'Multi-option 2',
                index: 4,
            },
            {
                blockType: 'select-input-option',
                schemaBlockGroupKey: 'testMulti',
                displayText: 'Multi-option 3',
                index: 5,
            },
        ];
        const result = getSchemaBlockGroup(mulitSelectSchema, 'testMulti');
        assert.equal(result.registrationResponseKey, 'testMultiAnswer', 'has proper registrationResponseKey');
        assert.equal(result.schemaBlockGroupKey, 'testMulti', 'has proper schemaBlockGroupKey');
        assert.equal(result.optionBlocks!.length, 3, 'has proper optionBlocks');
        assert.equal(result.inputType, result.inputBlock!.blockType,
            'group input type matches blockType of inputBlock');
    });

    test('Group single choice question as schema block group', assert => {
        const mulitSelectSchema: SchemaBlock[] = [
            {
                blockType: 'question-label',
                displayText: 'Single Select',
                schemaBlockGroupKey: 'testSingle',
                index: 0,
            },
            {
                blockType: 'single-select-input',
                schemaBlockGroupKey: 'testSingle',
                registrationResponseKey: 'testSingleAnswer',
                index: 1,
            },
            {
                blockType: 'select-input-option',
                schemaBlockGroupKey: 'testSingle',
                displayText: 'single-option 1',
                index: 2,
            },
            {
                blockType: 'select-input-option',
                schemaBlockGroupKey: 'testSingle',
                displayText: 'single-option 2',
                index: 3,
            },
        ];
        const result = getSchemaBlockGroup(mulitSelectSchema, 'testSingle');
        assert.equal(result.registrationResponseKey, 'testSingleAnswer', 'has proper registrationResponseKey');
        assert.equal(result.schemaBlockGroupKey, 'testSingle', 'has proper schemaBlockGroupKey');
        assert.equal(result.optionBlocks!.length, 2, 'has proper optionsBlocks');
        assert.equal(result.inputType, result.inputBlock!.blockType,
            'group input type matches blockType of inputBlock');
    });
});
