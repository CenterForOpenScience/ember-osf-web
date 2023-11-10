import { AsyncHasMany, hasMany } from '@ember-data/model';

import OsfModel from './osf-model';
import ConfiguredStorageAccountModel from './configured-storage-addon';

export default class OsfResourceModel extends OsfModel {
    @hasMany('configured-storage-account', { inverse: null })
    configuredStorageAddons!: AsyncHasMany<ConfiguredStorageAccountModel> & ConfiguredStorageAccountModel[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'osf-resource': OsfResourceModel;
    } // eslint-disable-line semi
}
