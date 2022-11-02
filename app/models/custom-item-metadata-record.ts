import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import GuidModel from 'ember-osf-web/models/user';

import OsfModel from './osf-model';

export interface Funder {
    funderName: string;
    funderIdentifier: string;
    funderIdentifierType: string;
    awardNumber: string;
    awardUri: string;
    awardTitle: string;
}

export default class CustomItemMetadataRecordModel extends OsfModel {
    @attr('fixstring') resource_type_general?: string;
    @attr('fixstring') language?: string;
    @attr('array') funders?: Funder[];

    @belongsTo('guid', { inverse: 'customMetadata' })
    guid!: AsyncBelongsTo<GuidModel> & GuidModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'custom-item-metadata-record': CustomItemMetadataRecordModel;
    } // eslint-disable-line semi
}
