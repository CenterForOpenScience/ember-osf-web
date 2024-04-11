import { attr } from '@ember-data/model';

import OsfModel from './osf-model';
import { CredentialsFormat, TermsOfServiceCapabilities } from './external-storage-service';

export default class ExternalCitationServiceModel extends OsfModel {
    @attr('fixstring') name!: string;
    @attr('string') iconUrl!: string;
    @attr('string') credentialsFormat!: CredentialsFormat;
    @attr('array') termsOfService!: TermsOfServiceCapabilities[];
    // TODO: actually need some attrs here for citation service options
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'external-citation-service': ExternalCitationServiceModel;
    } // eslint-disable-line semi
}
