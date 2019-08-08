import { attr } from '@ember-decorators/data';

import OsfModel from './osf-model';

export default class SchemaBlockModel extends OsfModel {
    @attr('string') blockType!: string;
    @attr('string') chunkId!: string;
    @attr('string') answerId!: string;
    @attr('string') displayText!: string;
    @attr('string') helpText!: string;
    @attr('boolean') required!: boolean;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'schema-block': SchemaBlockModel;
    } // eslint-disable-line semi
}
