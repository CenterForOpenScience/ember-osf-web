import DS from 'ember-data';
import RegistrationModel from 'ember-osf-web/models/registration';
import UserModel from 'ember-osf-web/models/user';

import OsfModel from './osf-model';

const { attr, belongsTo } = DS;

export enum RegistrationRequestStates {
    Initial = 'initial',
    Pending = 'pending',
    Accepted = 'accepted',
    Rejected = 'rejected',
}

export default class RegistrationRequestModel extends OsfModel {
    @attr('fixstring') requestType!: string;
    @attr('fixstring') reviewsState!: RegistrationRequestStates;
    @attr('fixstring') comment!: string;
    @attr('date') created!: Date;
    @attr('date') modified!: Date;
    @attr('date') dateLastTransitioned!: Date | null;

    @belongsTo('user', { inverse: null }) creator!: UserModel;
    @belongsTo('registration', { inverse: 'requests' }) target!: RegistrationModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'registration-request': RegistrationRequestModel;
    } // eslint-disable-line semi
}
