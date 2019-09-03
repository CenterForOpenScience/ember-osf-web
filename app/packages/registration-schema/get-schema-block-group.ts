import { assert } from '@ember/debug';
import { SchemaBlock, SchemaBlockGroup } from 'ember-osf-web/packages/registration-schema';

function isEmpty(input: string | undefined) {
    if (input === undefined || input === null || input === '') {
        return true;
    }
    return false;
}

export function getSchemaBlockGroup(blocks: SchemaBlock[], key: string) {
    const schemaBlockGroup: SchemaBlockGroup = {};
    let lastGroupIndex: number | undefined;
    let consecutiveGroup = true;
    const groupBlocks = blocks.filter(block => block.schemaBlockGroupKey === key);
    groupBlocks.forEach(groupBlock => {
        if (lastGroupIndex && groupBlock.index && Math.abs(lastGroupIndex - groupBlock.index) !== 1) {
            consecutiveGroup = false;
        }
        lastGroupIndex = groupBlock.index;
        if (groupBlock.schemaBlockGroupKey === key) {
            switch (groupBlock.blockType) {
            case 'question-label':
                schemaBlockGroup.labelBlock = groupBlock;
                break;
            case 'long-text-input':
            case 'short-text-input':
            case 'file-input':
            case 'contributors-input':
            case 'single-select-input':
            case 'multi-select-input':
                assert('input block with no schemaBlockGroupKey!', !isEmpty(groupBlock.schemaBlockGroupKey));
                assert('input block with no registrationResponseKey!', !isEmpty(groupBlock.registrationResponseKey));
                assert('question with multiple input blocks!', !schemaBlockGroup.inputBlock);
                if (schemaBlockGroup.schemaBlockGroupKey) {
                    assert('question with mismatched schemaBlockGroupKey!',
                        schemaBlockGroup.schemaBlockGroupKey === groupBlock.schemaBlockGroupKey);
                } else {
                    schemaBlockGroup.schemaBlockGroupKey = groupBlock.schemaBlockGroupKey;
                }
                schemaBlockGroup.inputBlock = groupBlock;
                schemaBlockGroup.registrationResponseKey = groupBlock.registrationResponseKey;
                break;
            case 'select-input-option':
                if (schemaBlockGroup.inputBlock) {
                    assert('question with mismatched schemaBlockGroupKey!',
                        !isEmpty(groupBlock.schemaBlockGroupKey) &&
                        schemaBlockGroup.schemaBlockGroupKey === groupBlock.schemaBlockGroupKey);
                    schemaBlockGroup.optionBlocks = [
                        ...(schemaBlockGroup.optionBlocks || []),
                        groupBlock,
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
    assert('non-consecutive blocks used to create group', consecutiveGroup);
    assert('schema block group with no input element',
        schemaBlockGroup.inputBlock !== null && schemaBlockGroup.inputBlock !== undefined);
    if ((schemaBlockGroup.inputBlock) &&
        (schemaBlockGroup.inputBlock.blockType === 'single-select-input' ||
        schemaBlockGroup.inputBlock.blockType === 'multi-select-input')) {
        assert('single/multi select with no option',
            schemaBlockGroup.optionBlocks && schemaBlockGroup.optionBlocks.length > 0);
    }
    schemaBlockGroup.inputType = schemaBlockGroup.inputBlock!.blockType;
    return schemaBlockGroup;
}
