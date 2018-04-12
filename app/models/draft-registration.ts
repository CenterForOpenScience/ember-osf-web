import { attr, belongsTo } from '@ember-decorators/data';
import OsfModel from './osf-model';

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
export default class DraftRegistration extends OsfModel {
    @attr('fixstring') registrationSupplement;
    @attr('object') registrationMetadata;
    @attr('date') datetimeInitiated;
    @attr('date') datetimeUpdated;
    @belongsTo('node', { inverse: null }) branchedFrom;
    @belongsTo('user', { inverse: null }) initiator;
    @belongsTo('metaschema', { inverse: null }) registrationSchema;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'draft-registration': DraftRegistration;
    }
}
