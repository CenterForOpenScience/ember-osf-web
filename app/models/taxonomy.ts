import { attr } from '@ember-decorators/data';
import OsfModel from './osf-model';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 preprints. This model may be used with one of several API endpoints. It may be queried directly.
 * In the future, there will be multiple taxonomy endpoints under the same namespace.
 * For field and usage information, see:
 * https://api.osf.io/v2/docs/#!/v2/Plos_Taxonomy_GET
 * @class Taxonomy
 */
export default class Taxonomy extends OsfModel {
    @attr('fixstring') text;
    @attr('string') shareTitle;
    @attr('string') path;
    // TODO: Api implements this as a list field for now. This should be a relationship field in the future, when API
    // supports it
    @attr('number') childCount;
    @attr('object') parent; // eslint-disable-line no-restricted-globals
}

declare module 'ember-data' {
    interface ModelRegistry {
        'taxonomy': Taxonomy;
    }
}
