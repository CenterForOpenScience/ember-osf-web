import { attr } from '@ember-data/model';

import OsfModel from './osf-model';

export default class NodeAddonModel extends OsfModel {
    @attr('boolean') nodeHasAuth!: boolean;
    @attr('boolean') configured!: boolean;
    @attr('string') externalAccountId!: string;
    @attr('string') folderId?: string;
    @attr('string') folderPath?: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'node-addon': NodeAddonModel;
    } // eslint-disable-line semi
}
