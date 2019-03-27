import { attr } from '@ember-decorators/data';

import OsfModel from './osf-model';

export default class CitationStyleModel extends OsfModel {
    @attr('fixstring') title?: string;
    @attr('fixstring') shortTitle?: string;
    @attr('fixstring') summary?: string;
    @attr('date') dateParsed?: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'citation-style': CitationStyleModel;
    } // eslint-disable-line semi
}
