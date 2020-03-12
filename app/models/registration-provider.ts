import DS from 'ember-data';

import ProviderModel from './provider';
import RegistrationModel from './registration';
import BrandAssetsModel from './brand-assets';

const { hasMany } = DS;

export default class RegistrationProviderModel extends ProviderModel {
    @hasMany('registration', { inverse: 'provider' })
    registrations!: DS.PromiseManyArray<RegistrationModel>;

    @hasMany('brand-assets', { inverse: null })
    brandAssets?: DS.PromiseManyArray<BrandAssetsModel>;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'registration-provider': RegistrationProviderModel;
    } // eslint-disable-line semi
}
