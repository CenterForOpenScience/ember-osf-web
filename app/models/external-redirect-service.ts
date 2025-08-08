import { attr } from '@ember-data/model';

import ExternalServiceModel from './external-service';

export default class ExternalRedirectServiceModel extends ExternalServiceModel {
    @attr('string') redirectUrl!: string;
    // TODO: actually need some attrs here for redirect options
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'external-redirect-service': ExternalRedirectServiceModel;
    } // eslint-disable-line semi
}
