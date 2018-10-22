import { attr, hasMany } from '@ember-decorators/data';
import { alias } from '@ember-decorators/object/computed';
import DS from 'ember-data';
import Preprint from './preprint';
import Provider from './provider';

export default class PreprintProvider extends Provider {
    @attr('array') subjectsAcceptable!: string[];
    @attr('array') additionalProviders!: string[];
    @attr('string') shareSource!: string;
    @attr('string') preprintWord!: string;

    // Reviews settings
    @attr('array') permissions!: string[];
    @attr('string') reviewsWorkflow!: string | null;
    @attr('boolean', { allowNull: true }) reviewsCommentsPrivate!: boolean | null;
    @attr('boolean', { allowNull: true }) reviewsCommentsAnonymous!: boolean | null;

    // Relationships
    @hasMany('preprint', { inverse: 'provider' }) preprints!: DS.PromiseManyArray<Preprint>;

    @alias('links.relationships.preprints.links.related.meta')
    reviewableStatusCounts!: any;

    @alias('links.relationships.highlighted_taxonomies.links.related.meta.has_highlighted_subjects')
    hasHighlightedSubjects!: boolean;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'preprint-provider': PreprintProvider;
    } // eslint-disable-line semi
}
