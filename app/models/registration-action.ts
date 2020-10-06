import DS from 'ember-data';
import OsfModel from 'ember-osf-web/models/osf-model';
import RegistrationModel from 'ember-osf-web/models/registration';
import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import UserModel from 'ember-osf-web/models/user';

const { attr, belongsTo } = DS;

export default class RegistrationActionModel extends OsfModel {
    @attr('string') actionTrigger!: string;
    @attr('string') comment!: string;
    @attr('string') fromState!: string;
    @attr('string') toState!: string;
    @attr('date') dateCreated!: Date;
    @attr('date') dateModified!: Date;
    @attr('boolean') auto!: boolean;
    @attr('boolean') visible!: boolean;

    @belongsTo('registration-provider', { inverse: 'actions' })
    provider!: DS.PromiseObject<RegistrationProviderModel> & RegistrationProviderModel;

    @belongsTo('registration', { inverse: 'reviewActions' })
    target!: DS.PromiseObject<RegistrationModel> & RegistrationModel;

    @belongsTo('user', { inverse: null })
    creator!: DS.PromiseObject<UserModel> & UserModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'registration-action': RegistrationActionModel;
    } // eslint-disable-line semi
}
