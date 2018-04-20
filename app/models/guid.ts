import { computed } from '@ember-decorators/object';
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
    get referentType(this: Guid): string {
        return singularize(this.get('links.relationships.referent.data.type'));
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
