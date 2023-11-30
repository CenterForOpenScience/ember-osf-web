import { AsyncHasMany, hasMany } from '@ember-data/model';

import OsfModel from './osf-model';
import ConfiguredStorageAddonModel from './configured-storage-addon';

export default class InternalResourceModel extends OsfModel {
    @hasMany('configured-storage-addon', { inverse: 'authorizedResource' })
    configuredStorageAddons!: AsyncHasMany<ConfiguredStorageAddonModel> & ConfiguredStorageAddonModel[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'internal-resource': InternalResourceModel;
    } // eslint-disable-line semi
}
