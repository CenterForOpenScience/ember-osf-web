import { computed } from '@ember/object';
import DS from 'ember-data';

import RegistrationSchemaModel from 'ember-osf-web/models/registration-schema';
import { SchemaBlock, SchemaBlockType } from 'ember-osf-web/packages/registration-schema';
import { getPageParam } from 'ember-osf-web/utils/page-param';

import OsfModel from './osf-model';

const { attr, belongsTo } = DS;

export default class SchemaBlockModel extends OsfModel implements SchemaBlock {
    @attr('string') blockType?: SchemaBlockType;
    @attr('string') schemaBlockGroupKey?: string;
    @attr('registration-response-key') registrationResponseKey?: string | null;
    @attr('string') displayText?: string;
    @attr('string') helpText?: string;
    @attr('string') exampleText?: string;
    @attr('boolean') required?: boolean;
    @attr('number') index?: number;

    @belongsTo('registration-schema', { inverse: 'schemaBlocks', async: false })
    schema?: RegistrationSchemaModel;

    @computed('id')
    get elementId() {
        return this.id;
    }

    @computed('schema.schemaBlocks')
    get pageRouteParam(): string | null {
        if (this.schema && this.schema.schemaBlocks) {
            const thisBlockIndex = this.index!;
            // Get an array of page heading blocks and their page index in reverse
            const headingBlocksAndPageIndex = this.schema.schemaBlocks
                .filter(block => block.blockType === 'page-heading')
                .map((block, index) => ({ block, index }))
                .reverse();
            // Find the page heading block and page index for this block
            const result = headingBlocksAndPageIndex.find(item => thisBlockIndex >= item.block.index!);
            if (result) {
                return getPageParam(result.index, result.block.displayText);
            }
            return null;
        }
        return null;
    }
}
declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'schema-block': SchemaBlockModel;
    } // eslint-disable-line semi
}
