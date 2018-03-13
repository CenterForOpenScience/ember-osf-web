import DS from 'ember-data';
import OsfModel from './osf-model';

const { attr, belongsTo } = DS;

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 draft registrations.
 * This model represents draft registration data and can be accessed as a relationship of a node.
 * For information on how to interact with a node's draft registrations, see:
 * * https://api.osf.io/v2/docs/#!/v2/Node_Draft_Registrations_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Node_Draft_Registration_Detail_GET
 * @class DraftRegistration
 */
export default class DraftRegistration extends OsfModel.extend({
    registrationSupplement: attr('fixstring'),
    registrationMetadata: attr('object'),
    datetimeInitiated: attr('date'),
    datetimeUpdated: attr('date'),
    branchedFrom: belongsTo('node', {
        inverse: null,
    }),
    initiator: belongsTo('user', {
        inverse: null,
    }),
    registrationSchema: belongsTo('metaschema', {
        inverse: null,
    }),
}) {}

declare module 'ember-data' {
    interface ModelRegistry {
        'draft-registration': DraftRegistration;
    }
}
