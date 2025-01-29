import ExternalServiceModel from './external-service';

export default class ExternalComputingServiceModel extends ExternalServiceModel {
    // TODO: actually need some attrs here for cloud computing options
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'external-computing-service': ExternalComputingServiceModel;
    } // eslint-disable-line semi
}
