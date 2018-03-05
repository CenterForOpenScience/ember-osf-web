import DS from 'ember-data';
import OsfModel from './osf-model';
/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 institutions. This model may be used with one of several API endpoints. It may be queried directly,
 *  or accessed via relationship fields.
 * For field and usage information, see:
 * * https://api.osf.io/v2/docs/#!/v2/Institution_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Institution_Detail_GET
 * * https://api.osf.io/v2/docs/#!/v2/Node_Institutions_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Registration_Institutions_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/User_Institutions_GET
 * @class Institution
 */
export default class Institution extends OsfModel.extend({
    name: DS.attr('string'),
    description: DS.attr('fixstring'),
    logoPath: DS.attr('string'),
    authUrl: DS.attr('string'),
    users: DS.hasMany('users', {
        inverse: 'institutions',
    }),
    nodes: DS.hasMany('nodes', {
        inverse: 'affiliatedInstitutions',
    }),
    registrations: DS.hasMany('registrations', {
        inverse: 'affiliatedInstitutions',
    }),
}) {
  // normal class body definition here
}


declare module 'ember-data' {
    interface ModelRegistry {
        'institution': Institution;
    }
}
