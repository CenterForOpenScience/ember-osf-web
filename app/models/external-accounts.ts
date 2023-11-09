import { attr } from '@ember-data/model';

import OsfModel from './osf-model';

export default class ExternalAccountsModel extends OsfModel {
    @attr('string') provider!: string;
    @attr('fixstring') profileUrl?: string;
    @attr('fixstring') displayName!: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'external-account': ExternalAccountsModel;
    } // eslint-disable-line semi
}