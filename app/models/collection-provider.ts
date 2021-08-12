import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import { belongsTo, AsyncBelongsTo } from '@ember-data/model';

import CollectionModel from './collection';
import ProviderModel from './provider';

export default class CollectionProviderModel extends ProviderModel {
    @belongsTo('collection')
    primaryCollection!: AsyncBelongsTo<CollectionModel> & CollectionModel;

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
