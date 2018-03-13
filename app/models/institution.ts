import DS from 'ember-data';
import OsfModel from './osf-model';

const { attr, hasMany } = DS;

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 institutions. This model may be used with one of several API endpoints. It may be queried
 * directly, or accessed via relationship fields.
 * For field and usage information, see:
 * * https://api.osf.io/v2/docs/#!/v2/Institution_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Institution_Detail_GET
 * * https://api.osf.io/v2/docs/#!/v2/Node_Institutions_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Registration_Institutions_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/User_Institutions_GET
 * @class Institution
 */
export default class Institution extends OsfModel.extend({
    name: attr('string'),
    description: attr('fixstring'),
    logoPath: attr('string'),
    authUrl: attr('string'),
    users: hasMany('user', {
        inverse: 'institutions',
    }),
    nodes: hasMany('node', {
        inverse: 'affiliatedInstitutions',
    }),
    registrations: hasMany('registration', {
        inverse: 'affiliatedInstitutions',
    }),
}) {}

declare module 'ember-data' {
    interface ModelRegistry {
        'institution': Institution;
    }
}
