import { alias } from '@ember/object/computed';
import DS from 'ember-data';
import OsfModel from 'ember-osf-web/models/osf-model';

const { attr, hasMany } = DS;

export default class PreprintProvider extends OsfModel.extend({
    name: attr('fixstring'),
    description: attr('fixstring'),
    domain: attr('string'),
    domainRedirectEnabled: attr('boolean'),
    example: attr('fixstring'),
    advisoryBoard: attr('string'),
    emailSupport: attr('fixstring'),
    subjectsAcceptable: attr('array'),
    footerLinks: attr('string'),
    allowSubmissions: attr('boolean'),
    additionalProviders: attr('array'),
    shareSource: attr('string'),
    preprintWord: attr('string'),

    // Reviews settings
    permissions: attr('array'),
    reviewsWorkflow: attr('string'),
    reviewsCommentsPrivate: attr('boolean', { allowNull: true }),
    reviewsCommentsAnonymous: attr('boolean', { allowNull: true }),
    // Relationships
    taxonomies: hasMany('taxonomy'),
    highlightedTaxonomies: hasMany('taxonomy'),
    preprints: hasMany('preprint', { inverse: 'provider', async: true }),
    licensesAcceptable: hasMany('license', { inverse: null }),
}) {
    reviewableStatusCounts = alias('links.relationships.preprints.links.related.meta');
    // tslint:disable-next-line max-line-length
    hasHighlightedSubjects = alias('links.relationships.highlighted_taxonomies.links.related.meta.has_highlighted_subjects'); // eslint-disable-line max-len
}

declare module 'ember-data' {
    interface ModelRegistry {
        'preprint-provider': PreprintProvider;
    }
}
