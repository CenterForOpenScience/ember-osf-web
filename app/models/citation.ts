import { attr } from '@ember-decorators/data';

import OsfModel from './osf-model';

export default class CitationModel extends OsfModel {
    @attr('string') citation!: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        citation: CitationModel;
    } // eslint-disable-line semi
}
