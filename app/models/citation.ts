import DS from 'ember-data';
import OsfModel from './osf-model';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 citation styles
 *
 * @class Citation
 */
export default class Citation extends OsfModel.extend({
    citation: DS.attr('string'),
}) {
  // normal class body definition here
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data' {
  interface ModelRegistry {
    'citation': Citation;
  }
}
