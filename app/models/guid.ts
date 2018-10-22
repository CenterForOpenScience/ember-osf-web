import { computed } from '@ember-decorators/object';
import ModelRegistry from 'ember-data/types/registries/model';
import { singularize } from 'ember-inflector';
import OsfModel from './osf-model';

/**
 * @module ember-osf-web
 * @submodule models
 */

export type ReferentModelName = 'file' | 'node' | 'preprint' | 'registration' | 'user';
export type ReferentModel = ModelRegistry[ReferentModelName];

/**
 * Model for GUIDs
 * @class Guid
 */
export default class Guid extends OsfModel {
    @computed('id')
    get referentType(this: Guid): ReferentModelName {
        return singularize(this.links.relationships.referent.data.type) as ReferentModelName;
    }

    resolve(this: Guid) {
        return this.store.findRecord(this.referentType, this.id);
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        guid: Guid;
    } // eslint-disable-line semi
}
