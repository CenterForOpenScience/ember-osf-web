import { attr } from '@ember-data/model';

import OsfModel from './osf-model';

export default class CitationServiceModel extends OsfModel {
    @attr('fixstring') name!: string;
    @attr('fixstring') iconUri!: string;
    @attr('fixstring') authUri!: string;
    // TODO: actually need some attrs here for citation service options
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'citation-service': CitationServiceModel;
    } // eslint-disable-line semi
}
