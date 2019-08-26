import { SchemaBlock } from 'ember-osf-web/models/schema-block';
import { getPages, getQuestionChunk } from 'ember-osf-web/utils/schema-blocks';
import { module, test } from 'qunit';

module('Unit | Utility | schema-blocks', () => {
    test('Chunk multipage schema', assert => {
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
                blockType: 'question-title',
                displayText: 'Question Title in the First Page',
                chunkId: 'q1',
                index: 2,
            },
            {
                blockType: 'short-text-input',
                displayText: 'Text Input in the First Page',
                chunkId: 'q1',
                answerId: 'a1',
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
                blockType: 'question-title',
                displayText: 'Single Select on Page Two',
                chunkId: 'q2',
                index: 6,
            },
            {
                blockType: 'single-select-input',
                chunkId: 'q2',
                answerId: 'a2',
                index: 7,
            },
            {
                blockType: 'select-input-option',
                displayText: 'Opt1 for Single Select',
                chunkId: 'q2',
                index: 8,
            },
            {
                blockType: 'select-input-option',
                displayText: 'Opt2 for Single Select',
                chunkId: 'q2',
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

    test('Chunk single page schema', assert => {
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
                blockType: 'question-title',
                displayText: 'Question Title in the First Page',
                chunkId: 'q1',
                index: 2,
            },
            {
                blockType: 'short-text-input',
                displayText: 'Text Input in the First Page',
                chunkId: 'q1',
                answerId: 'a1',
                index: 3,
            },
        ];
        const result = getPages(singlepageSchema);
        assert.equal(result.length, 1, 'has proper page length');
    });

    test('Chunk schema with no page-heading', assert => {
        const noPageHeadingSchema: SchemaBlock[] = [
            {
                blockType: 'section-heading',
                displayText: 'Section in the First Page',
                index: 0,
            },
            {
                blockType: 'question-title',
                displayText: 'Question Title in the First Page',
                chunkId: 'q1',
                index: 1,
            },
            {
                blockType: 'short-text-input',
                displayText: 'Text Input in the First Page',
                chunkId: 'q1',
                answerId: 'a1',
                index: 2,
            },
        ];
        const result = getPages(noPageHeadingSchema);
        assert.equal(result.length, 1, 'has proper page length');
    });

    test('Chunk stand alone input as question chunk', assert => {
        const standAloneSchema: SchemaBlock[] = [
            {
                blockType: 'section-heading',
                displayText: 'Section in the First Page',
                index: 0,
            },
            {
                blockType: 'short-text-input',
                chunkId: 'q1',
                answerId: 'a1',
                index: 1,
            },
        ];
        const result = getQuestionChunk(standAloneSchema, 'q1');
        assert.equal(result.answerId, 'a1', 'has proper answerId');
        assert.equal(result.chunkId, 'q1', 'has proper chunkId');
        assert.ok(!result.optionBlocks, 'has proper optionBlocks');
    });

    test('Chunk multiple choice question as schema chunk', assert => {
        const mulitSelectSchema: SchemaBlock[] = [
            {
                blockType: 'section-heading',
                displayText: 'Extraneous heading',
                index: 0,
            },
            {
                blockType: 'question-title',
                displayText: 'Multi Select',
                chunkId: 'testMulti',
                index: 1,
            },
            {
                blockType: 'multi-select-input',
                chunkId: 'testMulti',
                answerId: 'testMultiAnswer',
                index: 2,
            },
            {
                blockType: 'select-input-option',
                chunkId: 'testMulti',
                displayText: 'Multi-option 1',
                index: 3,
            },
            {
                blockType: 'select-input-option',
                chunkId: 'testMulti',
                displayText: 'Multi-option 2',
                index: 4,
            },
            {
                blockType: 'select-input-option',
                chunkId: 'testMulti',
                displayText: 'Multi-option 3',
                index: 5,
            },
        ];
        const result = getQuestionChunk(mulitSelectSchema, 'testMulti');
        assert.equal(result.answerId, 'testMultiAnswer', 'has proper answerId');
        assert.equal(result.chunkId, 'testMulti', 'has proper chunkId');
        assert.equal(result.optionBlocks!.length, 3, 'has proper optionBlocks');
    });

    test('Chunk single choice question as schema chunk', assert => {
        const mulitSelectSchema: SchemaBlock[] = [
            {
                blockType: 'question-title',
                displayText: 'Single Select',
                chunkId: 'testSingle',
                index: 0,
            },
            {
                blockType: 'single-select-input',
                chunkId: 'testSingle',
                answerId: 'testSingleAnswer',
                index: 1,
            },
            {
                blockType: 'select-input-option',
                chunkId: 'testSingle',
                displayText: 'single-option 1',
                index: 2,
            },
            {
                blockType: 'select-input-option',
                chunkId: 'testSingle',
                displayText: 'single-option 2',
                index: 3,
            },
        ];
        const result = getQuestionChunk(mulitSelectSchema, 'testSingle');
        assert.equal(result.answerId, 'testSingleAnswer', 'has proper answerId');
        assert.equal(result.chunkId, 'testSingle', 'has proper chunkId');
        assert.equal(result.optionBlocks!.length, 2, 'has proper optionsBlocks');
    });
});
