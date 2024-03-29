import { attr } from '@ember-data/model';
import { tracked } from '@glimmer/tracking';
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
    @attr('object') template!: any;
    @attr('number') templateVersion!: number;

    @tracked recordCreated!: boolean;

    get canSelect() {
        return !this.recordCreated;
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'cedar-metadata-template': CedarMetadataTemplateModel;
    } // eslint-disable-line semi
}
