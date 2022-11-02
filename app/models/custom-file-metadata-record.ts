import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import GuidModel from 'ember-osf-web/models/user';

import OsfModel from './osf-model';


export default class CustomFileMetadataRecordModel extends OsfModel {
    @attr('fixstring') title?: string;
    @attr('fixstring') description?: string;
    @attr('fixstring') resource_type_general?: string;
    @attr('fixstring') language?: string;

    @belongsTo('guid', { inverse: 'customMetadata' })
    guid!: AsyncBelongsTo<GuidModel> & GuidModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'custom-file-metadata-record': CustomFileMetadataRecordModel;
    } // eslint-disable-line semi
}
