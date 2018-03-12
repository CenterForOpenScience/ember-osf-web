import DS from 'ember-data';
import OsfModel from './osf-model';

const { attr } = DS;

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
    citation: attr('string'),
}) {}

declare module 'ember-data' {
  interface ModelRegistry {
    'citation': Citation;
  }
}
