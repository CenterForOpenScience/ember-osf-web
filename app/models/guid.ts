import { computed } from '@ember-decorators/object';
import { ModelRegistry } from 'ember-data';
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

declare module 'ember-data' {
    interface ModelRegistry {
        guid: Guid;
    }
}
