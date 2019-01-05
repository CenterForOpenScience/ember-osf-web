import { hasMany } from '@ember-decorators/data';
import DS from 'ember-data';

import ProviderModel from './provider';
import RegistrationModel from './registration';

export default class RegistryProviderModel extends ProviderModel {
    @hasMany('registration', { inverse: 'provider' })
    registrations!: DS.PromiseManyArray<RegistrationModel>;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'registry-provider': RegistryProviderModel;
    } // eslint-disable-line semi
}
