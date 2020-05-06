import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import DS from 'ember-data';

import ContributorModel from './contributor';
import FileModel from './file';
import LicenseModel from './license';
import NodeModel from './node';
import OsfModel from './osf-model';
import PreprintProviderModel from './preprint-provider';
import ReviewActionModel from './review-action';
import SubjectModel from './subject';

const { attr, belongsTo, hasMany } = DS;

export default class PreprintModel extends OsfModel {
    @attr('fixstring') title!: string;
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

    @belongsTo('node', { inverse: 'preprints' })
    node!: DS.PromiseObject<NodeModel> & NodeModel;

    @belongsTo('license', { inverse: null })
    license!: DS.PromiseObject<LicenseModel> & LicenseModel;

    @belongsTo('file', { inverse: null })
    primaryFile!: DS.PromiseObject<FileModel> & FileModel;

    @belongsTo('preprint-provider', { inverse: 'preprints' })
    provider!: DS.PromiseObject<PreprintProviderModel> & PreprintProviderModel;

    @hasMany('review-action', { inverse: 'target' })
    reviewActions!: DS.PromiseManyArray<ReviewActionModel>;

    @hasMany('contributor')
    contributors!: DS.PromiseManyArray<ContributorModel>;

    @hasMany('subject', { inverse: null, async: false })
    subjects!: DS.PromiseManyArray<SubjectModel>;

    @alias('links.doi') articleDoiUrl!: string | null;
    @alias('links.preprint_doi') preprintDoiUrl!: string;

    @computed('license')
    get licenseText(): string {
        const text: string = this.license.get('text') || '';
        const { year = '', copyright_holders = [] } = this.licenseRecord; // eslint-disable-line camelcase

        return text
            .replace(/({{year}})/g, year)
            .replace(/({{copyrightHolders}})/g, copyright_holders.join(', '));
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        preprint: PreprintModel;
    } // eslint-disable-line semi
}
