import { attr, belongsTo } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';
import RegistrationSchemaModel from 'ember-osf-web/models/registration-schema';
import { SchemaBlock, SchemaBlockType } from 'ember-osf-web/packages/registration-schema';
import { getPageParam } from 'ember-osf-web/utils/page-param';
import OsfModel from './osf-model';

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
    get pageRouteParam() {
        if (this.schema && this.schema.schemaBlocks) {
            // Get all the page-heading blocks
            const pageHeadingBlocks = this.schema.schemaBlocks.filter(block => block.blockType === 'page-heading');
            // Interate over all the page-heading blocks, starting from the first one
            for (let pageIndex = 0; pageIndex < pageHeadingBlocks.length; pageIndex++) {
                // If we reach the last page-heading block,
                // that means the current block is on the pase page
                if (pageIndex === pageHeadingBlocks.length - 1) {
                    return getPageParam(pageIndex, pageHeadingBlocks[pageIndex].displayText);
                }

                // Otherwise, if the current block's index is >= the current page-heading block's index
                // and < than the next page-heading block's index,
                // that means the current block is on the page marked by the current pageIndex
                const currentPageHeadingBlock = pageHeadingBlocks[pageIndex];
                const nextPageHeadingBlock = pageHeadingBlocks[pageIndex + 1];
                if (this.index! >= currentPageHeadingBlock.index! && this.index! < nextPageHeadingBlock.index!) {
                    return getPageParam(pageIndex, currentPageHeadingBlock.displayText);
                }
            }
        }
        return null;
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'schema-block': SchemaBlockModel;
    } // eslint-disable-line semi
}
