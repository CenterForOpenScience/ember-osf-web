import DS from 'ember-data';

import OsfModel from './osf-model';

const { attr } = DS;

export default class CitationModel extends OsfModel {
    @attr('string') citation!: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        citation: CitationModel;
    } // eslint-disable-line semi
}
