import { attr } from '@ember-data/model';

import OsfModel from './osf-model';
import { CredentialsFormat } from './external-storage-service';

export default class CitationServiceModel extends OsfModel {
    @attr('fixstring') name!: string;
    @attr('fixstring') iconUri!: string;
    @attr('fixstring') authUri!: string;
    @attr('string') credentialsFormat!: CredentialsFormat;
    // TODO: actually need some attrs here for citation service options
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'citation-service': CitationServiceModel;
    } // eslint-disable-line semi
}
