import { attr, belongsTo, hasMany } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import DS from 'ember-data';
import Contributor from './contributor';
import File from './file';
import License from './license';
import Node from './node';
import OsfModel from './osf-model';
import PreprintProvider from './preprint-provider';
import ReviewAction from './review-action';
import { SubjectRef } from './taxonomy';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 preprints. This model may be used with one of several API endpoints. It may be queried directly,
 *  or accessed via relationship fields.
 *
 * @class Preprint
 */
export default class Preprint extends OsfModel {
    @attr('fixstring') title!: string;
    // TODO!: May be a relationship in the future pending APIv2 changes
    @attr('object') subjects!: [ SubjectRef[] ];
    @attr('date') dateCreated!: Date;
    @attr('date') datePublished!: Date;
    @attr('date') originalPublicationDate!: Date | null;
    @attr('date') dateModified!: Date;
    @attr('fixstring') doi!: string | null;
    @attr('boolean') isPublished!: boolean;
    @attr('boolean') isPreprintOrphan!: boolean;
    @attr('object') licenseRecord!: any;
    @attr('string') reviewsState!: string;
    @attr('date') dateLastTransitioned!: Date;
    @attr('date') preprintDoiCreated!: Date;

    // Relationships
    @belongsTo('node', { inverse: 'preprints' }) node!: DS.PromiseObject<Node> & Node;
    @belongsTo('license', { inverse: null }) license!: DS.PromiseObject<License> & License;
    @belongsTo('file', { inverse: null }) primaryFile!: DS.PromiseObject<File> & File;

    @belongsTo('preprint-provider', { inverse: 'preprints' })
    provider!: DS.PromiseObject<PreprintProvider> & PreprintProvider;

    @hasMany('review-action', { inverse: 'target' }) reviewActions!: DS.PromiseManyArray<ReviewAction>;
    @hasMany('contributor') contributors!: DS.PromiseManyArray<Contributor>;

    @alias('links.doi') articleDoiUrl!: string | null;
    @alias('links.preprint_doi') preprintDoiUrl!: string;

    @computed('subjects')
    get uniqueSubjects(this: Preprint): SubjectRef[] {
        if (!this.get('subjects')) {
            return [];
        }

        return this.get('subjects')
            .reduce((acc, val) => acc.concat(val), [])
            .uniqBy('id');
    }

    @computed('license')
    get licenseText(this: Preprint): string {
        const text: string = this.license.get('text') || '';
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
