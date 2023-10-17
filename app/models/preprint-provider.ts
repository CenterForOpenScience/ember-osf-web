import { attr, hasMany, AsyncHasMany, belongsTo, AsyncBelongsTo } from '@ember-data/model';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import config from 'ember-osf-web/config/environment';
import Intl from 'ember-intl/services/intl';
import BrandModel from 'ember-osf-web/models/brand';

import { RelatedLinkMeta } from 'osf-api';

import PreprintModel from './preprint';
import ProviderModel, { ReviewPermissions } from './provider';

export type PreprintWord = 'default' | 'work' | 'paper' | 'preprint' | 'thesis';
export type PreprintWordGrammar = 'plural' | 'pluralCapitalized' | 'singular' | 'singularCapitalized';

const { defaultProvider } = config;
export default class PreprintProviderModel extends ProviderModel {
    @service intl!: Intl;

    @attr('fixstring') email_support!: string | null;
    @attr('array') subjectsAcceptable!: string[];
    @attr('array') additionalProviders!: string[];
    @attr('string') shareSource!: string;
    @attr('string') preprintWord!: PreprintWord;

    // Reviews settings
    @attr('array') permissions!: ReviewPermissions[];
    @attr('boolean', { allowNull: true }) reviewsCommentsPrivate!: boolean | null;

    // Relationships
    @belongsTo('brand')
    brand!: AsyncBelongsTo<BrandModel> & BrandModel;

    @hasMany('preprint', { inverse: 'provider' })
    preprints!: AsyncHasMany<PreprintModel>;

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

    @computed('documentType.plural')
    get searchPlaceholder(): string {
        return this.intl.t('preprints.header.search_placeholder',
            { placeholder: this.documentType.plural});
    }

    @computed('id')
    get preprintWordNotInTitle() {
        return this.id === 'thesiscommons';
    }

    // Is either OSF Preprints if provider is the default provider,
    // name+preprintWord.pluralCapitalized(e.g.AfricArXiv Preprints or MarXiv Papers), or "Thesis Commons"
    @computed('documentType.pluralCapitalized', 'id', 'name', 'preprintWordNotInTitle')
    get providerTitle() {
        if (this.id !== defaultProvider) {
            if (this.preprintWordNotInTitle) {
                return this.name;
            }
            return this.intl.t('preprints.provider-title',
                { name: this.name, pluralizedPreprintWord: this.documentType.pluralCapitalized });
        } else {
            return this.intl.t('preprints.header.osf_registrations');
        }
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'preprint-provider': PreprintProviderModel;
    } // eslint-disable-line semi
}
