import ExternalServiceModel from './external-service';

export default class ExternalCitationServiceModel extends ExternalServiceModel {
    // TODO: actually need some attrs here for citation service options
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'external-citation-service': ExternalCitationServiceModel;
    } // eslint-disable-line semi
}
