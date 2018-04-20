import { attr, belongsTo } from '@ember-decorators/data';
import DS from 'ember-data';
import Metaschema from './metaschema';
import Node from './node';
import OsfModel from './osf-model';
import User from './user';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 draft registrations.
 * This model represents draft registration data and can be accessed as a relationship of a node.
 *
 * @class DraftRegistration
 */
export default class DraftRegistration extends OsfModel {
    @attr('fixstring') registrationSupplement: string;
    @attr('object') registrationMetadata: any;
    @attr('date') datetimeInitiated: Date;
    @attr('date') datetimeUpdated: Date;
    @belongsTo('node', { inverse: null }) branchedFrom: DS.PromiseObject<Node> & Node;
    @belongsTo('user', { inverse: null }) initiator: DS.PromiseObject<User> & User;
    @belongsTo('metaschema', { inverse: null }) registrationSchema: DS.PromiseObject<Metaschema> & Metaschema;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'draft-registration': DraftRegistration;
    }
}
