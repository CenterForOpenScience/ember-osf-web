import { AsyncBelongsTo, belongsTo } from '@ember-data/model';
import GuidModel from 'ember-osf-web/models/user';

import OsfModel from './osf-model';

export default class CustomMetadataModel extends OsfModel {
    @belongsTo('guid', { inverse: 'customMetadata' })
    guid!: AsyncBelongsTo<GuidModel> & GuidModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'custom-metadata': CustomMetadataModel;
    } // eslint-disable-line semi
}
