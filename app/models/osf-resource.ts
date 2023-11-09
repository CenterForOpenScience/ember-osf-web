import { hasMany } from '@ember-data/model';

import OsfModel from './osf-model';

export default class OsfResourceModel extends OsfModel {
    @hasMany('authorized-storage-account', { inverse: null })
    configuredStorageAddons!: never[]; // types?
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'osf-resource': OsfResourceModel;
    } // eslint-disable-line semi
}
