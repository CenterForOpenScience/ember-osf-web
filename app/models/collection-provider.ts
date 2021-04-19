import { AsyncBelongsTo, belongsTo } from '@ember-data/model';

import CollectionModel from './collection';
import ProviderModel from './provider';

export default class CollectionProviderModel extends ProviderModel {
    @belongsTo('collection')
    primaryCollection!: AsyncBelongsTo<CollectionModel>;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'collection-provider': CollectionProviderModel;
    } // eslint-disable-line semi
}
