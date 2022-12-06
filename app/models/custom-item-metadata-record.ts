import { attr } from '@ember-data/model';
import CustomMetadataModel from 'ember-osf-web/models/custom-metadata';


export interface Funder {
    funderName?: string;
    funderIdentifier?: string;
    funderIdentifierType?: string;
    awardNumber?: string;
    awardUri?: string;
    awardTitle?: string;
}

export default class CustomItemMetadataRecordModel extends CustomMetadataModel {
    @attr('fixstring') language?: string;
    @attr('array') funders?: Funder[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'custom-item-metadata-record': CustomItemMetadataRecordModel;
    } // eslint-disable-line semi
}
