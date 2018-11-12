import { attr, hasMany } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import { getOwner } from '@ember/application';
import { get } from '@ember/object';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';

import Preprint from './preprint';
import Provider from './provider';

export default class PreprintProvider extends Provider {
    @service i18n!: I18N;

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

    @computed('i18n.locale', 'preprintWord')
    get documentType() {
        const locale = getOwner(this).factoryFor(`locale:${this.i18n.locale}/translations`).class;
        return get(locale, `documentType.${this.preprintWord}`);
    }
}

declare module 'ember-data' {
    interface ModelRegistry {
        'preprint-provider': PreprintProvider;
    }
}
