import { inject as service } from '@ember/service';
import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';
import IntlService from 'ember-intl/services/intl';

export interface LanguageText {
    '@language': string;
    '@value': string;
}

export default class IndexCardModel extends Model {
    @service intl!: IntlService;

    @attr('array') resourceType!: string[];
    @attr('array') resourceIdentifier!: string[];
    @attr('object') resourceMetadata!: any;

    @hasMany('index-card', { inverse: null })
    relatedRecordSet!: AsyncHasMany<IndexCardModel> & IndexCardModel[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'index-card': IndexCardModel;
    } // eslint-disable-line semi
}
