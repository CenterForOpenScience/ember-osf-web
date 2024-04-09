import { attr } from '@ember-data/model';

import OsfModel from './osf-model';
import { CredentialsFormat, TermsOfServiceCapabilities } from './external-storage-service';

export default class ExternalComputingServiceModel extends OsfModel {
    @attr('fixstring') name!: string;
    @attr('string') iconUrl!: string;
    @attr('string') credentialsFormat!: CredentialsFormat;
    @attr('fixstringarray') termsOfService!: TermsOfServiceCapabilities[];
    // TODO: actually need some attrs here for cloud computing options
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'external-computing-service': ExternalComputingServiceModel;
    } // eslint-disable-line semi
}
