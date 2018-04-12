import { attr, hasMany } from '@ember-decorators/data';
import { alias } from '@ember-decorators/object/computed';
import OsfModel from 'ember-osf-web/models/osf-model';

export default class PreprintProvider extends OsfModel {
    @attr('fixstring') name; // eslint-disable-line no-restricted-globals
    @attr('fixstring') description;
    @attr('string') domain;
    @attr('boolean') domainRedirectEnabled;
    @attr('fixstring') example;
    @attr('string') advisoryBoard;
    @attr('fixstring') emailSupport;
    @attr('array') subjectsAcceptable;
    @attr('string') footerLinks;
    @attr('boolean') allowSubmissions;
    @attr('array') additionalProviders;
    @attr('string') shareSource;
    @attr('string') preprintWord;

    // Reviews settings
    @attr('array') permissions;
    @attr('string') reviewsWorkflow;
    @attr('boolean', { allowNull: true }) reviewsCommentsPrivate;
    @attr('boolean', { allowNull: true }) reviewsCommentsAnonymous;
    // Relationships
    @hasMany('taxonomy') taxonomies;
    @hasMany('taxonomy') highlightedTaxonomies;
    @hasMany('preprint', { inverse: 'provider', async: true }) preprints;
    @hasMany('license', { inverse: null }) licensesAcceptable;

    @alias('links.relationships.preprints.links.related.meta')
    reviewableStatusCounts;

    @alias('links.relationships.highlighted_taxonomies.links.related.meta.has_highlighted_subjects')
    hasHighlightedSubjects;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'preprint-provider': PreprintProvider;
    }
}
