import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import DS from 'ember-data';

import { RelatedLinkMeta } from 'osf-api';

import PreprintModel from './preprint';
import ProviderModel from './provider';

const { attr, hasMany } = DS;

const documentType = {
    default: {
        plural: 'documents',
        pluralCapitalized: 'Documents',
        singular: 'document',
        singularCapitalized: 'Document',
    },
    work: {
        plural: 'works',
        pluralCapitalized: 'Works',
        singular: 'work',
        singularCapitalized: 'Work',
    },
    paper: {
        plural: 'papers',
        pluralCapitalized: 'Papers',
        singular: 'paper',
        singularCapitalized: 'Paper',
    },
    preprint: {
        plural: 'preprints',
        pluralCapitalized: 'Preprints',
        singular: 'preprint',
        singularCapitalized: 'Preprint',
    },
    thesis: {
        plural: 'theses',
        pluralCapitalized: 'Theses',
        singular: 'thesis',
        singularCapitalized: 'Thesis',
    },
};

export type DocumentTypes = keyof typeof documentType;

export type PreprintDocumentType = typeof documentType[DocumentTypes];

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

    @alias('links.relationships.highlighted_subjects.links.related.meta.has_highlighted_subjects')
    hasHighlightedSubjects!: boolean;

    @computed('preprintWord')
    get documentType(): PreprintDocumentType {
        // TODO: make this actually intl once we swicth to ember-intl
        return documentType[this.preprintWord];
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'preprint-provider': PreprintProviderModel;
    } // eslint-disable-line semi
}
