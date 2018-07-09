import { belongsTo, hasMany } from '@ember-decorators/data';
import DS from 'ember-data';
import Collection from './collection';
import Provider from './provider';

export default class CollectionProvider extends Provider {
    @belongsTo('collection') primaryCollection!: DS.PromiseObject<Collection> & Collection;
    @hasMany('collection', { inverse: 'provider' }) collections!: DS.PromiseManyArray<Collection>;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'collection-provider': CollectionProvider;
    }
}
