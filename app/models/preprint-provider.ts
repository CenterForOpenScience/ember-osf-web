import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import DS from 'ember-data';
import Intl from 'ember-intl/services/intl';

import { RelatedLinkMeta } from 'osf-api';

import PreprintModel from './preprint';
import ProviderModel from './provider';

const { attr, hasMany } = DS;

export type PreprintWord = 'default' | 'work' | 'paper' | 'preprint' | 'thesis';
export type PreprintWordGrammar = 'plural' | 'pluralCapitalized' | 'singular' | 'singularCapitalized';

export default class PreprintProviderModel extends ProviderModel {
    @service intl!: Intl;

    @attr('array') subjectsAcceptable!: string[];

    @attr('array') additionalProviders!: string[];

    @attr('string') shareSource!: string;

    @attr('string') preprintWord!: PreprintWord;

    // Reviews settings
    @attr('array') permissions!: string[];

    @attr('string') reviewsWorkflow!: string | null;

    @attr('boolean', { allowNull: true }) reviewsCommentsPrivate!: boolean | null;

    @attr('boolean', { allowNull: true }) reviewsCommentsAnonymous!: boolean | null;

    // Relationships
    @hasMany('preprint', { inverse: 'provider' })
    preprints!: DS.PromiseManyArray<PreprintModel>;

    @alias('links.relationships.preprints.links.related.meta')
    reviewableStatusCounts!: RelatedLinkMeta;

    @alias('links.relationships.highlighted_subjects.links.related.meta.has_highlighted_subjects')
    hasHighlightedSubjects!: boolean;

    @computed('intl.locale', 'preprintWord')
    get documentType(): Record<PreprintWordGrammar, string> {
        const { preprintWord } = this;
        const documentType = `documentType.${preprintWord}`;
        return {
            plural: this.intl.t(`${documentType}.plural`),
            pluralCapitalized: this.intl.t(`${documentType}.pluralCapitalized`),
            singular: this.intl.t(`${documentType}.singular`),
            singularCapitalized: this.intl.t(`${documentType}.singularCapitalized`),
        };
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'preprint-provider': PreprintProviderModel;
    } // eslint-disable-line semi
}
