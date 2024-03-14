import { AsyncHasMany, attr, hasMany } from '@ember-data/model';

import OsfModel from './osf-model';
import ConfiguredStorageAddonModel from './configured-storage-addon';
import ConfiguredCitationServiceAddonModel from './configured-citation-service-addon';
import ConfiguredComputingAddonModel from './configured-computing-addon';

export default class ResourceReferenceModel extends OsfModel {

    @attr('fixstring') resourceUri!: string;

    @hasMany('configured-storage-addon', { inverse: 'authorizedResource' })
    configuredStorageAddons!: AsyncHasMany<ConfiguredStorageAddonModel> & ConfiguredStorageAddonModel[];

    @hasMany('configured-citation-service-addon', { inverse: 'authorizedResource' })
    configuredCitationServiceAddons!: AsyncHasMany<ConfiguredCitationServiceAddonModel>
        & ConfiguredCitationServiceAddonModel[];

    @hasMany('configured-computing-addon', { inverse: 'authorizedResource' })
    configuredComputingAddons!: AsyncHasMany<ConfiguredComputingAddonModel>
        & ConfiguredComputingAddonModel[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'resource-reference': ResourceReferenceModel;
    } // eslint-disable-line semi
}
