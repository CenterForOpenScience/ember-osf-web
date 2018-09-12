import { attr, belongsTo } from '@ember-decorators/data';
import DS from 'ember-data';

import Node from './node';
import OsfModel from './osf-model';
import RegistrationSchema, { RegistrationMetadata } from './registration-schema';
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
    @attr('fixstring') registrationSupplement!: string;
    @attr('object') registrationMetadata!: RegistrationMetadata;
    @attr('date') datetimeInitiated!: Date;
    @attr('date') datetimeUpdated!: Date;
    @belongsTo('node', { inverse: null }) branchedFrom!: DS.PromiseObject<Node> & Node;
    @belongsTo('user', { inverse: null }) initiator!: DS.PromiseObject<User> & User;
    @belongsTo('registration-schema', { inverse: null })
    registrationSchema!: DS.PromiseObject<RegistrationSchema> & RegistrationSchema;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'draft-registration': DraftRegistration;
    }
}
