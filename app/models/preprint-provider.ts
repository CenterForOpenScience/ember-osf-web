import { alias } from '@ember/object/computed';
import DS from 'ember-data';
import OsfModel from 'ember-osf-web/models/osf-model';

export default class PreprintProvider extends OsfModel.extend({
    name: DS.attr('fixstring'),
    description: DS.attr('fixstring'),
    domain: DS.attr('string'),
    domainRedirectEnabled: DS.attr('boolean'),
    example: DS.attr('fixstring'),
    advisoryBoard: DS.attr('string'),
    emailSupport: DS.attr('fixstring'),
    subjectsAcceptable: DS.attr('array'),
    footerLinks: DS.attr('string'),
    allowSubmissions: DS.attr('boolean'),
    additionalProviders: DS.attr(''),
    shareSource: DS.attr('string'),
    preprintWord: DS.attr('string'),

    // Reviews settings
    permissions: DS.attr('array'),
    reviewsWorkflow: DS.attr('string'),
    reviewsCommentsPrivate: DS.attr('boolean', { allowNull: true }),
    reviewsCommentsAnonymous: DS.attr('boolean', { allowNull: true }),
    // Relationships
    taxonomies: DS.hasMany('taxonomy'),
    highlightedTaxonomies: DS.hasMany('taxonomy'),
    preprints: DS.hasMany('preprint', { inverse: 'provider', async: true }),
    licensesAcceptable: DS.hasMany('license', { inverse: null }),
}) {
    reviewableStatusCounts = alias('links.relationships.preprints.links.related.meta');
    hasHighlightedSubjects = alias('links.relationships.highlighted_taxonomies.links.related.meta.has_highlighted_subjects');
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data' {
    interface ModelRegistry {
        'preprint-provider': PreprintProvider;
    }
}
