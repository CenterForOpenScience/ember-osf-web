import DS from 'ember-data';

import BrandModel from './brand';
import ProviderModel from './provider';
import RegistrationModel from './registration';

const { attr, hasMany, belongsTo } = DS;

export default class RegistrationProviderModel extends ProviderModel {
    @hasMany('registration', { inverse: 'provider' })
    registrations!: DS.PromiseManyArray<RegistrationModel>;

    @belongsTo('brand')
    brand!: DS.PromiseObject<BrandModel> & BrandModel;

    @attr('fixstring')
    shareSourceKey?: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'registration-provider': RegistrationProviderModel;
    } // eslint-disable-line semi
}
