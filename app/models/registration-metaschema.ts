import { attr } from '@ember-decorators/data';
import OsfModel from './osf-model';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 metaschemas.
 * This model describes metaschemas and can be directly queried.
 *
 * @class Metaschema
 */
export default class RegistrationMetaschema extends OsfModel {
    @attr('fixstring') name!: string; // eslint-disable-line no-restricted-globals
    @attr('number') schemaVersion!: number;
    @attr('object') schema!: any;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'registration-metaschema': RegistrationMetaschema;
    }
}
