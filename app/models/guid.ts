import { computed } from '@ember/object';
import { singularize } from 'ember-inflector';

import OsfModel from './osf-model';

export type ReferentModelName = 'file' | 'node' | 'preprint' | 'registration' | 'user';

export default class GuidModel extends OsfModel {
    @computed('id')
    get referentType() {
        const { relationships } = this.links;
        if (relationships &&
            'data' in relationships.referent &&
            relationships.referent.data &&
            'type' in relationships.referent.data) {
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
