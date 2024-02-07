import { AsyncHasMany, hasMany } from '@ember-data/model';

import OsfModel from './osf-model';
import ConfiguredStorageAddonModel from './configured-storage-addon';

export default class ResourceReferenceModel extends OsfModel {
    @hasMany('configured-storage-addon', { inverse: 'authorizedResource' })
    configuredStorageAddons!: AsyncHasMany<ConfiguredStorageAddonModel> & ConfiguredStorageAddonModel[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'resource-reference': ResourceReferenceModel;
    } // eslint-disable-line semi
}
