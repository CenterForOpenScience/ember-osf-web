import { attr } from '@ember-data/model';
import Model from '@ember-data/model';

export default class CrossrefFunderModel extends Model {
    @attr('string') name!: string;
    @attr('string') uri!: string;
    @attr('string') location!: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'crossref-funder': CrossrefFunderModel;
    } // eslint-disable-line semi
}
