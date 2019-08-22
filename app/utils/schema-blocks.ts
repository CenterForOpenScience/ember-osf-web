import { assert } from '@ember/debug';
import { SchemaBlock } from 'ember-osf-web/models/schema-block';

export class QuestionChunk {
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

            const lastPage: Array<SchemaBlock | QuestionChunk> = pages.slice(-1)[0];
            if (block.blockType === 'page-heading') {
                pages.push([block]);
            } else {
                lastPage.push(block);
            }
            return pages;
        },
        [] as Array<Array<SchemaBlock | QuestionChunk>>,
    );
    return pageArray;
}

export function getQuestionChunk(blocks: SchemaBlock[], id: string) {
    const questionChunk: QuestionChunk = {};
    blocks.forEach(block => {
        if (block.chunkId === id) {
            switch (block.blockType) {
            case 'question-title':
                questionChunk.labelBlock = block;
                break;
            case 'long-text-input':
            case 'short-text-input':
            case 'file-input':
            case 'contributors-input':
            case 'single-select-input':
            case 'multi-select-input':
                assert('input block with no answerID!', !isEmpty(block.answerId));
                assert('input block with no chunkID!', !isEmpty(block.chunkId));
                assert('question with multiple input blocks!', !questionChunk.inputBlock);
                if (questionChunk.chunkId) {
                    assert('question with mismatched chunkID!', questionChunk.chunkId === block.chunkId);
                } else {
                    questionChunk.chunkId = block.chunkId;
                }
                questionChunk.inputBlock = block;
                questionChunk.answerId = block.answerId;
                break;
            case 'select-input-option':
                if (questionChunk.inputBlock) {
                    assert('question with mismatched chunkID!',
                        !isEmpty(block.chunkId) && questionChunk.chunkId === block.chunkId);
                    questionChunk.optionBlocks = [
                        ...(questionChunk.optionBlocks || []),
                        block,
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
