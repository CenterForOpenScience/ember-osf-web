import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import DS from 'ember-data';
import OsfModel from './osf-model';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 preprints. This model may be used with one of several API endpoints. It may be queried directly,
 *  or accessed via relationship fields.
 * For field and usage information, see:
 * https://api.osf.io/v2/docs/#!/v2/Preprint_List_GET
 * https://api.osf.io/v2/docs/#!/v2/Preprint_Detail_GET
 * https://api.osf.io/v2/docs/#!/v2/User_Preprints_GET
 * @class Preprint
 */
export default class Preprint extends OsfModel.extend({
    title: DS.attr('fixstring'),
    // TODO: May be a relationship in the future pending APIv2 changes
    subjects: DS.attr('object'),
    dateCreated: DS.attr('date'),
    datePublished: DS.attr('date'),
    originalPublicationDate: DS.attr('date'),
    dateModified: DS.attr('date'),
    doi: DS.attr('fixstring'),
    isPublished: DS.attr('boolean'),
    isPreprintOrphan: DS.attr('boolean'),
    licenseRecord: DS.attr('object'),
    reviewsState: DS.attr('string'),
    dateLastTransitioned: DS.attr('date'),
    preprintDoiCreated: DS.attr('date'),

    // Relationships
    node: DS.belongsTo('node', { inverse: null, async: true }),
    license: DS.belongsTo('license', { inverse: null }),
    primaryFile: DS.belongsTo('file', { inverse: null }),
    provider: DS.belongsTo('preprint-provider', { inverse: 'preprints', async: true }),
    reviewActions: DS.hasMany('review-action', { inverse: 'target', async: true }),
    contributors: DS.hasMany('contributors', { async: true }),
}) {
    articleDoiUrl = alias('links.doi');
    preprintDoiUrl = alias('links.preprint_doi');

    uniqueSubjects = computed('subjects', function(): Array<any> {
        if (!this.get('subjects')) return [];
        return this.get('subjects').reduce((acc, val) => acc.concat(val), []).uniqBy('id');
    });

    licenseText = computed('license', function(): string {
        const text: string = this.get('license.text') || '';
        const { year = '', copyright_holders = [] } = this.get('licenseRecord'); // eslint-disable-line camelcase

        return text
            .replace(/({{year}})/g, year)
            .replace(/({{copyrightHolders}})/g, copyright_holders.join(', '));
    });
}


declare module 'ember-data' {
    interface ModelRegistry {
        'preprint': Preprint;
    }
}
