import { AsyncBelongsTo, belongsTo } from '@ember-data/model';
import { computed } from '@ember/object';
import { singularize } from 'ember-inflector';
import CustomFileMetadataRecordModel from 'ember-osf-web/models/custom-file-metadata-record';
import CustomItemMetadataRecordModel from 'ember-osf-web/models/custom-item-metadata-record';

import OsfModel from './osf-model';

export type ReferentModelName = 'file' | 'node' | 'preprint' | 'registration' | 'user';

export default class GuidModel extends OsfModel {
    @belongsTo('custom-metadata', {inverse: 'guid', polymorphic: true})
    customMetadata!: (
        AsyncBelongsTo<CustomFileMetadataRecordModel> & CustomFileMetadataRecordModel |
        AsyncBelongsTo<CustomItemMetadataRecordModel> & CustomItemMetadataRecordModel
    );

    @computed('id', 'links')
    get referentType() {
        const { relationships } = this.links;
        if (relationships
            && 'data' in relationships.referent
            && relationships.referent.data
            && 'type' in relationships.referent.data) {
            return singularize(relationships.referent.data.type) as ReferentModelName;
        }
        return undefined;
    }

    resolve() {
        return this.referentType ? this.store.findRecord(this.referentType, this.id) : undefined;
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        guid: GuidModel;
    } // eslint-disable-line semi
}
