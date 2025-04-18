import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';

import ConfiguredStorageAddonModel from './configured-storage-addon';
import ConfiguredCitationAddonModel from './configured-citation-addon';
import ConfiguredComputingAddonModel from './configured-computing-addon';

export default class ResourceReferenceModel extends Model {

    @attr('fixstring') resourceUri!: string;

    @hasMany('configured-storage-addon', { inverse: 'authorizedResource' })
    configuredStorageAddons!: AsyncHasMany<ConfiguredStorageAddonModel> & ConfiguredStorageAddonModel[];

    @hasMany('configured-citation-addon', { inverse: 'authorizedResource' })
    configuredCitationAddons!: AsyncHasMany<ConfiguredCitationAddonModel>
        & ConfiguredCitationAddonModel[];

    @hasMany('configured-computing-addon', { inverse: 'authorizedResource' })
    configuredComputingAddons!: AsyncHasMany<ConfiguredComputingAddonModel>
        & ConfiguredComputingAddonModel[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'resource-reference': ResourceReferenceModel;
    } // eslint-disable-line semi
}
