import DS from 'ember-data';

import CollectionModel from './collection';
import ProviderModel from './provider';

const { belongsTo } = DS;

export default class CollectionProviderModel extends ProviderModel {
    @belongsTo('collection')
    primaryCollection!: DS.PromiseObject<CollectionModel> & CollectionModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'collection-provider': CollectionProviderModel;
    } // eslint-disable-line semi
}
