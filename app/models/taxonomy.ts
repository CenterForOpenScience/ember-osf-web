import DS from 'ember-data';
import OsfModel from './osf-model';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 preprints. This model may be used with one of several API endpoints. It may be queried directly. In the future, there will be multiple taxonomy endpoints under the same namespace.
 * For field and usage information, see:
 * https://api.osf.io/v2/docs/#!/v2/Plos_Taxonomy_GET
 * @class Taxonomy
 */
export default class Taxonomy extends OsfModel.extend({
    text: DS.attr('fixstring'),
    shareTitle: DS.attr('string'),
    path: DS.attr('string'),
    // TODO: Api implements this as a list field for now. This should be a relationship field in the future, when API supports it
    child_count: DS.attr('number'),
    parent: DS.attr('object'),
}) {
    // normal class body definition here
}


declare module 'ember-data' {
    interface ModelRegistry {
        'taxonomy': Taxonomy;
    }
}
