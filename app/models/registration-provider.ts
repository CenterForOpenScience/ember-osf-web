import DS from 'ember-data';

import BrandAssetModel from './brand-asset';
import ProviderModel from './provider';
import RegistrationModel from './registration';

const { hasMany } = DS;

export default class RegistrationProviderModel extends ProviderModel {
    @hasMany('registration', { inverse: 'provider' })
    registrations!: DS.PromiseManyArray<RegistrationModel>;

    @hasMany('brand-asset', { inverse: null })
    brandAssets?: DS.PromiseManyArray<BrandAssetModel>;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'registration-provider': RegistrationProviderModel;
    } // eslint-disable-line semi
}
