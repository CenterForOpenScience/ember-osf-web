import { computed } from '@ember-decorators/object';
import { ModelRegistry } from 'ember-data';
import { singularize } from 'ember-inflector';
import OsfModel from './osf-model';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for GUIDs
 * @class Guid
 */
export default class Guid extends OsfModel {
    @computed('id')
    get referentType(this: Guid): keyof ModelRegistry {
        return singularize(this.links.relationships.referent.data.type) as keyof ModelRegistry;
    }

    @computed('id')
    get resolve(this: Guid): Promise<any> {
        return this.get('store').findRecord(this.get('referentType'), this.get('id'));
    }
}

declare module 'ember-data' {
    interface ModelRegistry {
        guid: Guid;
    }
}
