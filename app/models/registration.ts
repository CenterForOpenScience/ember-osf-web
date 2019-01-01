import { attr, belongsTo, hasMany } from '@ember-decorators/data';
import DS from 'ember-data';

import Comment from './comment';
import Contributor from './contributor';
import NodeModel from './node';
import RegistrationSchema, { RegistrationMetadata } from './registration-schema';
import RegistryProvider from './registry-provider';
import User from './user';

export default class RegistrationModel extends NodeModel.extend() {
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

    @belongsTo('node', { inverse: 'registrations' })
    registeredFrom!: DS.PromiseObject<NodeModel> & NodeModel;

    @belongsTo('user', { inverse: null })
    registeredBy!: DS.PromiseObject<User> & User;

    @belongsTo('registry-provider', { inverse: 'registrations' })
    provider!: DS.PromiseObject<RegistryProvider> & RegistryProvider;

    @hasMany('contributor', { inverse: 'node' })
    contributors!: DS.PromiseManyArray<Contributor>;

    @hasMany('comment', { inverse: 'node' })
    comments!: DS.PromiseManyArray<Comment>;

    @belongsTo('registration-schema', { inverse: null })
    registrationSchema!: DS.PromiseObject<RegistrationSchema> & RegistrationSchema;

    @belongsTo('registration', { inverse: 'children' })
    parent!: DS.PromiseObject<RegistrationModel> & RegistrationModel;

    @hasMany('registration', { inverse: 'parent' })
    children!: DS.PromiseManyArray<RegistrationModel>;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        registration: RegistrationModel;
    } // eslint-disable-line semi
}
