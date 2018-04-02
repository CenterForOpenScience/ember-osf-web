import DS from 'ember-data';
import OsfModel from './osf-model';

const { attr } = DS;

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 metaschemas.
 * This model describes metaschemas and can be directly queried.
 * For information on how to retrieve metaschemas see:
 * * https://api.osf.io/v2/docs/#!/v2/Meta_Schemas_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Meta_Schema_Detail_GET
 * @class Metaschema
 */
export default class Metaschema extends OsfModel.extend({
    name: attr('fixstring'),
    schemaVersion: attr('number'),
    schema: attr('object'),
}) {}

declare module 'ember-data' {
    interface ModelRegistry {
        'metaschema': Metaschema;
    }
}
