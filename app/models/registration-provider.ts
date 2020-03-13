import DS from 'ember-data';

import BrandAssetModel from './brand-asset';
import ProviderModel from './provider';
import RegistrationModel from './registration';

const { hasMany, belongsTo } = DS;

export default class RegistrationProviderModel extends ProviderModel {
    @hasMany('registration', { inverse: 'provider' })
    registrations!: DS.PromiseManyArray<RegistrationModel>;

    @belongsTo('brand-asset')
    brandAsset!: DS.PromiseObject<BrandAssetModel> & BrandAssetModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'registration-provider': RegistrationProviderModel;
    } // eslint-disable-line semi
}
