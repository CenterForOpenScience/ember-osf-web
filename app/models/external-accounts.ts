import { attr } from '@ember-data/model';

import OsfModel from './osf-model';

export default class ExternalAccountsModel extends OsfModel {
    @attr('string') provider!: string;
    @attr('string') profileUrl?: string;
    @attr('string') displayName!: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'external-account': ExternalAccountsModel;
    } // eslint-disable-line semi
}
