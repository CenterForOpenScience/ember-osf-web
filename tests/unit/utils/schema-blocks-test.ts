import { SchemaBlock } from 'ember-osf-web/models/schema-block';
import { getPages, getSchemaBlockGroup } from 'ember-osf-web/utils/schema-blocks';
import { module, test } from 'qunit';

module('Unit | Utility | schema-blocks', () => {
    test('Group multipage schema', assert => {
        const multipageSchema: SchemaBlock[] = [
            {
                blockType: 'page-heading',
                displayText: 'First Page',
                index: 0,
            },
            {
                blockType: 'section-heading',
                displayText: 'Section in the First Page',
                index: 1,
            },
            {
                blockType: 'question-label',
                displayText: 'Question Title in the First Page',
                schemaBlockGroupKey: 'q1',
                index: 2,
            },
            {
                blockType: 'short-text-input',
                displayText: 'Text Input in the First Page',
                schemaBlockGroupKey: 'q1',
                registrationResponseKey: 'a1',
                index: 3,
            },
            {
                blockType: 'page-heading',
                displayText: 'Second Page',
                index: 4,
            },
            {
                blockType: 'section-heading',
                displayText: 'Section in the Second Page',
                index: 5,
            },
            {
                blockType: 'question-label',
                displayText: 'Single Select on Page Two',
                schemaBlockGroupKey: 'q2',
                index: 6,
            },
            {
                blockType: 'single-select-input',
                schemaBlockGroupKey: 'q2',
                registrationResponseKey: 'a2',
                index: 7,
            },
            {
                blockType: 'select-input-option',
                displayText: 'Opt1 for Single Select',
                schemaBlockGroupKey: 'q2',
                index: 8,
            },
            {
                blockType: 'select-input-option',
                displayText: 'Opt2 for Single Select',
                schemaBlockGroupKey: 'q2',
                index: 9,
            },
            {
                blockType: 'page-heading',
                displayText: 'Third Page',
                index: 10,
            },
            {
                blockType: 'section-heading',
                displayText: 'Section in the Third Page',
                index: 11,
            },
        ];
        const result = getPages(multipageSchema);
        assert.equal(result.length, 3, 'has proper page length');
    });

    test('Group single page schema', assert => {
        const singlepageSchema: SchemaBlock[] = [
            {
                blockType: 'page-heading',
                displayText: 'First Page',
                index: 0,
            },
            {
                blockType: 'section-heading',
                displayText: 'Section in the First Page',
                index: 1,
            },
            {
                blockType: 'question-label',
                displayText: 'Question Title in the First Page',
                schemaBlockGroupKey: 'q1',
                index: 2,
            },
            {
                blockType: 'short-text-input',
                displayText: 'Text Input in the First Page',
                schemaBlockGroupKey: 'q1',
                registrationResponseKey: 'a1',
                index: 3,
            },
        ];
        const result = getPages(singlepageSchema);
        assert.equal(result.length, 1, 'has proper page length');
    });

    test('Group schema with no page-heading', assert => {
        const noPageHeadingSchema: SchemaBlock[] = [
            {
                blockType: 'section-heading',
                displayText: 'Section in the First Page',
                index: 0,
            },
            {
                blockType: 'question-label',
                displayText: 'Question Title in the First Page',
                schemaBlockGroupKey: 'q1',
                index: 1,
            },
            {
                blockType: 'short-text-input',
                displayText: 'Text Input in the First Page',
                schemaBlockGroupKey: 'q1',
                registrationResponseKey: 'a1',
                index: 2,
            },
        ];
        const result = getPages(noPageHeadingSchema);
        assert.equal(result.length, 1, 'has proper page length');
    });

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
    });
});
