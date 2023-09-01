import { attr, belongsTo, hasMany, SyncHasMany, AsyncBelongsTo, AsyncHasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

import ContributorModel from './contributor';
import FileModel from './file';
import LicenseModel from './license';
import NodeModel from './node';
import OsfModel from './osf-model';
import PreprintProviderModel from './preprint-provider';
import ReviewActionModel from './review-action';
import SubjectModel from './subject';

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
    @attr('array') currentUserPermissions!: string[];

    @belongsTo('node', { inverse: 'preprint' })
    node!: AsyncBelongsTo<NodeModel> & NodeModel;

    @belongsTo('license', { inverse: null })
    license!: AsyncBelongsTo<LicenseModel> & LicenseModel;

    @belongsTo('file', { inverse: null })
    primaryFile!: AsyncBelongsTo<FileModel> & FileModel;

    @belongsTo('preprint-provider', { inverse: 'preprints' })
    provider!: AsyncBelongsTo<PreprintProviderModel> & PreprintProviderModel;

    @hasMany('review-action', { inverse: 'target' })
    reviewActions!: AsyncHasMany<ReviewActionModel>;

    @hasMany('contributors', { inverse: 'preprint'})
    contributors!: AsyncHasMany<ContributorModel> & ContributorModel;

    @hasMany('contributor', { inverse: null })
    bibliographicContributors!: AsyncHasMany<ContributorModel>;

    @hasMany('subject', { inverse: null, async: false })
    subjects!: SyncHasMany<SubjectModel>;

    @alias('links.doi') articleDoiUrl!: string | null;
    @alias('links.preprint_doi') preprintDoiUrl!: string;

    @computed('license', 'licenseRecord')
    get licenseText(): string {
        const text = this.license.get('text') || '';
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
