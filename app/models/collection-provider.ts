import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import { belongsTo, hasMany, AsyncBelongsTo, AsyncHasMany } from '@ember-data/model';

import CollectionModel from './collection';
import ProviderModel from './provider';
import CollectionSubscriptionModel from './collection-subscription';

export default class CollectionProviderModel extends ProviderModel {
    @belongsTo('collection')
    primaryCollection!: AsyncBelongsTo<CollectionModel> & CollectionModel;

    @hasMany('collection-subscriptions', { inverse: 'provider' })
    subscriptions!: AsyncHasMany<CollectionSubscriptionModel>;

    @computed('description')
    get htmlSafeDescription() {
        if (this.description) {
            return htmlSafe(this.description);
        }
        return '';
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'collection-provider': CollectionProviderModel;
    } // eslint-disable-line semi
}
