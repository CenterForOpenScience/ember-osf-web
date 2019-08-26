import { assert } from '@ember/debug';
import { SchemaBlock } from 'ember-osf-web/models/schema-block';

export interface QuestionChunk {
  labelBlock?: SchemaBlock;
  inputBlock?: SchemaBlock;
  optionBlocks?: SchemaBlock[];
  chunkId?: string;
  answerId?: string;
}

function isEmpty(input: string | undefined) {
    if (input === undefined || input === null || input === '') {
        return true;
    }
    return false;
}

export function getPages(blocks: SchemaBlock[]) {
    const pageArray = blocks.reduce(
        (pages, block) => {
            // instantiate first page if the schema doesn't start with a page-heading
            if (pages.length === 0 && block.blockType !== 'page-heading') {
                const blankPage: SchemaBlock[] = [];
                pages.push(blankPage);
            }

            const lastPage: SchemaBlock[] = pages.slice(-1)[0];
            if (block.blockType === 'page-heading') {
                pages.push([block]);
            } else {
                lastPage.push(block);
            }
            return pages;
        },
        [] as SchemaBlock[][],
    );
    return pageArray;
}

export function getQuestionChunk(blocks: SchemaBlock[], id: string) {
    const questionChunk: QuestionChunk = {};
    let lastChunkIndex: number | undefined;
    let consecutiveChunks = true;
    const chunkBlocks = blocks.filter(block => block.chunkId === id);
    chunkBlocks.forEach(chunkBlock => {
        if (lastChunkIndex && chunkBlock.index && Math.abs(lastChunkIndex - chunkBlock.index) !== 1) {
            consecutiveChunks = false;
        }
        lastChunkIndex = chunkBlock.index;
        if (chunkBlock.chunkId === id) {
            switch (chunkBlock.blockType) {
            case 'question-title':
                questionChunk.labelBlock = chunkBlock;
                break;
            case 'long-text-input':
            case 'short-text-input':
            case 'file-input':
            case 'contributors-input':
            case 'single-select-input':
            case 'multi-select-input':
                assert('input block with no answerID!', !isEmpty(chunkBlock.answerId));
                assert('input block with no chunkID!', !isEmpty(chunkBlock.chunkId));
                assert('question with multiple input blocks!', !questionChunk.inputBlock);
                if (questionChunk.chunkId) {
                    assert('question with mismatched chunkID!', questionChunk.chunkId === chunkBlock.chunkId);
                } else {
                    questionChunk.chunkId = chunkBlock.chunkId;
                }
                questionChunk.inputBlock = chunkBlock;
                questionChunk.answerId = chunkBlock.answerId;
                break;
            case 'select-input-option':
                if (questionChunk.inputBlock) {
                    assert('question with mismatched chunkID!',
                        !isEmpty(chunkBlock.chunkId) && questionChunk.chunkId === chunkBlock.chunkId);
                    questionChunk.optionBlocks = [
                        ...(questionChunk.optionBlocks || []),
                        chunkBlock,
                    ];
                } else {
                    assert('select-option without a question!');
                }
                break;
            default:
                break;
            }
        }
    });
    assert('non-consecutive blocks used to create chunk', consecutiveChunks);
    assert('question chunk with no input element',
        questionChunk.inputBlock !== null && questionChunk.inputBlock !== undefined);
    if ((questionChunk.inputBlock) &&
        (questionChunk.inputBlock.blockType === 'single-select-input' ||
        questionChunk.inputBlock.blockType === 'multi-select-input')) {
        assert('single/multi select with no option',
            questionChunk.optionBlocks && questionChunk.optionBlocks.length > 0);
    }
    return questionChunk;
}
