import { attr, belongsTo, hasMany } from '@ember-decorators/data';
import DS from 'ember-data';
import Comment from './comment';
import Contributor from './contributor';
import Node from './node';
import RegistrationSchema, { RegistrationMetadata } from './registration-schema';
import User from './user';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 registrations. This model may be used with one of several API endpoints. It may be queried
 * directly, or accessed via relationship fields.
 *
 * @class Registration
 */
export default class Registration extends Node.extend() {
    @attr('date') dateRegistered!: Date;
    @attr('boolean') pendingRegistrationApproval!: boolean;
    @attr('boolean') archiving!: boolean;
    @attr('boolean') embargoed!: boolean;
    @attr('date') embargoEndDate!: Date | null;
    @attr('boolean') pendingEmbargoApproval!: boolean;
    @attr('boolean') withdrawn!: boolean;
    @attr('fixstring') withdrawalJustification?: string;
    @attr('boolean') pendingWithdrawal!: boolean;

    @attr('fixstring') registrationSupplement?: string;
    @attr('object') registeredMeta!: RegistrationMetadata;

    // Write-only attributes
    @attr('fixstring') draftRegistration?: string;
    @attr('fixstring') registrationChoice?: 'immediate' | 'embargo';
    @attr('date') liftEmbargo?: Date;

    @belongsTo('node', { inverse: 'registrations' }) registeredFrom!: DS.PromiseObject<Node> & Node;
    @belongsTo('user', { inverse: null }) registeredBy!: DS.PromiseObject<User> & User;
    @hasMany('contributor', { inverse: 'node' }) contributors!: DS.PromiseManyArray<Contributor>;
    @hasMany('comment', { inverse: 'node' }) comments!: DS.PromiseManyArray<Comment>;
    @belongsTo('registration-schema', { inverse: null })
    registrationSchema!: DS.PromiseObject<RegistrationSchema> & RegistrationSchema;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'registration': Registration;
    }
}
