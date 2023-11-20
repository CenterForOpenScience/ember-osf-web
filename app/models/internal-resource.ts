import { AsyncHasMany, hasMany } from '@ember-data/model';

import OsfModel from './osf-model';
import ConfiguredStorageAccountModel from './configured-storage-addon';

export default class InternalResourceModel extends OsfModel {
    @hasMany('configured-storage-account', { inverse: 'authorizedResource' })
    configuredStorageAddons!: AsyncHasMany<ConfiguredStorageAccountModel> & ConfiguredStorageAccountModel[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'internal-resource': InternalResourceModel;
    } // eslint-disable-line semi
}
