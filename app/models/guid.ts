import { computed } from '@ember/object';
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
export default class Guid extends OsfModel.extend({
    referentType: computed(function() {
        return singularize(this.get('links.relationships.referent.data.type'));
    }),
}) {
    resolve() {
        return this.get('store').findRecord(this.get('referentType'), this.get('id'));
    }
}

declare module 'ember-data' {
  interface ModelRegistry {
    'guid': Guid;
  }
}
