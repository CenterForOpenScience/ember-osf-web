import { attr, hasMany } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import DS from 'ember-data';

import translations from 'ember-osf-web/locales/en/translations';

import { RelatedLinkMeta } from 'osf-api';

import PreprintModel from './preprint';
import ProviderModel from './provider';

export type DocumentTypes = keyof typeof translations.documentType;

export type PreprintDocumentType = typeof translations.documentType[DocumentTypes];

export default class PreprintProviderModel extends ProviderModel {
    @attr('array') subjectsAcceptable!: string[];
    @attr('array') additionalProviders!: string[];
    @attr('string') shareSource!: string;
    @attr('string') preprintWord!: DocumentTypes;

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

    @alias('links.relationships.highlighted_taxonomies.links.related.meta.has_highlighted_subjects')
    hasHighlightedSubjects!: boolean;

    @computed('preprintWord')
    get documentType(): PreprintDocumentType {
        // TODO: make this actually i18n once we swicth to ember-intl
        return translations.documentType[this.preprintWord];
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'preprint-provider': PreprintProviderModel;
    } // eslint-disable-line semi
}
