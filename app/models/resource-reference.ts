import { AsyncHasMany, hasMany } from '@ember-data/model';

import OsfModel from './osf-model';
import ConfiguredStorageAddonModel from './configured-storage-addon';
import ConfiguredCitationServiceAddonModel from './configured-citation-service-addon';
import ConfiguredCloudComputingAddonModel from './configured-cloud-computing-addon';

export default class ResourceReferenceModel extends OsfModel {
    @hasMany('configured-storage-addon', { inverse: 'authorizedResource' })
    configuredStorageAddons!: AsyncHasMany<ConfiguredStorageAddonModel> & ConfiguredStorageAddonModel[];

    @hasMany('configured-citation-service-addon', { inverse: 'authorizedResource' })
    configuredCitationServiceAddons!: AsyncHasMany<ConfiguredCitationServiceAddonModel>
        & ConfiguredCitationServiceAddonModel[];

    @hasMany('configured-cloud-computing-addon', { inverse: 'authorizedResource' })
    configuredCloudComputingAddons!: AsyncHasMany<ConfiguredCloudComputingAddonModel>
        & ConfiguredCloudComputingAddonModel[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'resource-reference': ResourceReferenceModel;
    } // eslint-disable-line semi
}
