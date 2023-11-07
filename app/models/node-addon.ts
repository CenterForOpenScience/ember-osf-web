import { attr } from '@ember-data/model';

import OsfModel from './osf-model';

export default class NodeAddonModel extends OsfModel {
    @attr('boolean') nodeHasAuth!: boolean;
    @attr('boolean') configured!: boolean;
    @attr('string') external_account_id!: string;
    @attr('string') folder_id?: string;
    @attr('string') folder_path?: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'node-addon': NodeAddonModel;
    } // eslint-disable-line semi
}
