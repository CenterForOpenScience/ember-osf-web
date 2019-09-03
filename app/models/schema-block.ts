import { attr } from '@ember-decorators/data';
import { SchemaBlock, SchemaBlockType } from 'ember-osf-web/packages/registration-schema';
import OsfModel from './osf-model';

export default class SchemaBlockModel extends OsfModel implements SchemaBlock {
    @attr('string') blockType?: SchemaBlockType;
    @attr('string') schemaBlockGroupKey?: string;
    @attr('string') registrationResponseKey?: string;
    @attr('string') displayText?: string;
    @attr('string') helpText?: string;
    @attr('boolean') required?: boolean;
    @attr('number') index?: number;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'schema-block': SchemaBlockModel;
    } // eslint-disable-line semi
}
