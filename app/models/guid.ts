import { computed } from '@ember-decorators/object';
import ModelRegistry from 'ember-data/types/registries/model';
import { singularize } from 'ember-inflector';

import OsfModel from './osf-model';

export type ReferentModelName = 'file' | 'node' | 'preprint' | 'registration' | 'user';
export type ReferentModel = ModelRegistry[ReferentModelName];

export default class GuidModel extends OsfModel {
    @computed('id')
    get referentType() {
        return singularize(this.links.relationships.referent.data.type) as ReferentModelName;
    }

    resolve() {
        return this.store.findRecord(this.referentType, this.id);
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        guid: GuidModel;
    } // eslint-disable-line semi
}
