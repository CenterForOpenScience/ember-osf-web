import { attr } from '@ember-data/model';

import OsfModel from './osf-model';
import { CredentialsFormat } from './external-storage-service';

export default class CloudComputingServiceModel extends OsfModel {
    @attr('fixstring') name!: string;
    @attr('string') iconUri!: string;
    @attr('fixstring') authUri!: string;
    @attr('string') credentialsFormat!: CredentialsFormat;
    // TODO: actually need some attrs here for cloud computing options
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'cloud-computing-service': CloudComputingServiceModel;
    } // eslint-disable-line semi
}
