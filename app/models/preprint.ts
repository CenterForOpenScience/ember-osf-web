import { attr, belongsTo, hasMany } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
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
export default class Preprint extends OsfModel {
    @attr('fixstring') title;
    // TODO: May be a relationship in the future pending APIv2 changes
    @attr('object') subjects;
    @attr('date') dateCreated;
    @attr('date') datePublished;
    @attr('date') originalPublicationDate;
    @attr('date') dateModified;
    @attr('fixstring') doi;
    @attr('boolean') isPublished;
    @attr('boolean') isPreprintOrphan;
    @attr('object') licenseRecord;
    @attr('string') reviewsState;
    @attr('date') dateLastTransitioned;
    @attr('date') preprintDoiCreated;

    // Relationships
    @belongsTo('node', { inverse: null, async: true }) node;
    @belongsTo('license', { inverse: null }) license;
    @belongsTo('file', { inverse: null }) primaryFile;
    @belongsTo('preprint-provider', { inverse: 'preprints', async: true }) provider;
    @hasMany('review-action', { inverse: 'target', async: true }) reviewActions;
    @hasMany('contributor', { async: true }) contributors;

    @alias('links.doi') articleDoiUrl;
    @alias('links.preprint_doi') preprintDoiUrl;

    @computed('subjects')
    get uniqueSubjects(this: Preprint): any[] {
        if (!this.get('subjects')) {
            return [];
        }

        return this.get('subjects')
            .reduce((acc, val) => acc.concat(val), [])
            .uniqBy('id');
    }

    @computed('license')
    get licenseText(this: Preprint): string {
        const text: string = this.get('license.text') || '';
        const { year = '', copyright_holders = [] } = this.get('licenseRecord'); // eslint-disable-line camelcase

        return text
            .replace(/({{year}})/g, year)
            .replace(/({{copyrightHolders}})/g, copyright_holders.join(', '));
    }
}

declare module 'ember-data' {
    interface ModelRegistry {
        'preprint': Preprint;
    }
}
