import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import DS from 'ember-data';
import OsfModel from './osf-model';

const { attr, belongsTo, hasMany } = DS;

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
    title: attr('fixstring'),
    // TODO: May be a relationship in the future pending APIv2 changes
    subjects: attr('object'),
    dateCreated: attr('date'),
    datePublished: attr('date'),
    originalPublicationDate: attr('date'),
    dateModified: attr('date'),
    doi: attr('fixstring'),
    isPublished: attr('boolean'),
    isPreprintOrphan: attr('boolean'),
    licenseRecord: attr('object'),
    reviewsState: attr('string'),
    dateLastTransitioned: attr('date'),
    preprintDoiCreated: attr('date'),

    // Relationships
    node: belongsTo('node', { inverse: null, async: true }),
    license: belongsTo('license', { inverse: null }),
    primaryFile: belongsTo('file', { inverse: null }),
    provider: belongsTo('preprint-provider', { inverse: 'preprints', async: true }),
    reviewActions: hasMany('review-action', { inverse: 'target', async: true }),
    contributors: hasMany('contributor', { async: true }),
}) {
    articleDoiUrl = alias('links.doi');
    preprintDoiUrl = alias('links.preprint_doi');

    uniqueSubjects = computed('subjects', function(): any[] {
        if (!this.get('subjects')) {
            return [];
        }

        return this.get('subjects')
            .reduce((acc, val) => acc.concat(val), [])
            .uniqBy('id');
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
