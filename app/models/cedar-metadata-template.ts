import { attr } from '@ember-data/model';
import OsfModel from './osf-model';


/**
 * CedarMetadataTemplateModel
 *
 * @description The cedar metadata template model
 */
export default class CedarMetadataTemplateModel extends OsfModel {
    @attr('fixstring') schemaName!: string;
    @attr('fixstring') cedarId!: string;
    @attr('boolean') active!: boolean;
    @attr('fixstring') template!: string;
    @attr('fixstring') templateVersion!: number;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'cedar-metadata-templates': CedarMetadataTemplateModel;
    } // eslint-disable-line semi
}
