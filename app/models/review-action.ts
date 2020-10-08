import DS from 'ember-data';

import OsfModel from './osf-model';
import RegistrationModel from './registration';
import RegistrationProviderModel from './registration-provider';
import UserModel from './user';

const { attr, belongsTo } = DS;

export default class ReviewActionModel extends OsfModel {
    @attr('string') actionTrigger!: string;
    @attr('string') comment!: string;
    @attr('string') fromState!: string;
    @attr('string') toState!: string;
    @attr('date') dateCreated!: Date;
    @attr('date') dateModified!: Date;
    @attr('boolean') auto!: boolean;
    @attr('boolean') visible!: boolean;

    @belongsTo('registration-provider', { inverse: 'actions', polymorphic: true })
    provider!: DS.PromiseObject<RegistrationProviderModel> & RegistrationProviderModel;

    @belongsTo('registration', { inverse: 'reviewActions', polymorphic: true })
    target!: DS.PromiseObject<RegistrationModel> & RegistrationModel;

    @belongsTo('user', { inverse: null })
    creator!: DS.PromiseObject<UserModel> & UserModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'review-action': ReviewActionModel;
    } // eslint-disable-line semi
}
