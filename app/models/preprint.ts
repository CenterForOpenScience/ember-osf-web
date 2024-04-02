import { attr, belongsTo, hasMany, AsyncBelongsTo, AsyncHasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import CitationModel from 'ember-osf-web/models/citation';
import PreprintRequestModel from 'ember-osf-web/models/preprint-request';
import { ReviewsState } from 'ember-osf-web/models/provider';
import ReviewActionModel from 'ember-osf-web/models/review-action';

import ContributorModel from './contributor';
import FileModel from './file';
import IdentifierModel from './identifier';
import LicenseModel from './license';
import NodeModel from './node';
import OsfModel, { Permission } from './osf-model';
import PreprintProviderModel from './preprint-provider';
import SubjectModel from './subject';

export enum PreprintDataLinksEnum {
    AVAILABLE = 'available',
    YES = 'yes',
    NO = 'no',
    NOT_APPLICABLE = 'not_applicable',
}

export enum PreprintPreregLinksEnum {
    AVAILABLE = 'available',
    YES = 'yes',
    NO = 'no',
    NOT_APPLICABLE = 'not_applicable',
}

export default class PreprintModel extends OsfModel {
    @attr('fixstring') title!: string;
    @attr('date') dateCreated!: Date;
    @attr('date') datePublished!: Date;
    @attr('date') dateWithdrawn!: Date;
    @attr('date') originalPublicationDate!: Date | null;
    @attr('date') dateModified!: Date;
    @attr('fixstring') doi!: string | null;
    @attr('boolean') public!: boolean;
    @attr('boolean') isPublished!: boolean;
    @attr('boolean') isPreprintOrphan!: boolean;
    @attr('object') licenseRecord!: any;
    @attr('string') reviewsState!: ReviewsState;
    @attr('string') description!: string;
    @attr('date') dateLastTransitioned!: Date;
    @attr('date') preprintDoiCreated!: Date;
    @attr('array') currentUserPermissions!: Permission[];
    @attr('fixstringarray') tags!: string[];
    @attr('fixstring') withdrawalJustification!     : string;
    @attr('boolean') hasCoi!: boolean;
    @attr('string') hasDataLinks!: PreprintDataLinksEnum;
    @attr('string') hasPreregLinks!: PreprintPreregLinksEnum;
    @attr('string') conflictOfInterestStatement!: string;
    @attr('array') dataLinks!: string[];
    @attr('array') preregLinks!: string[];
    @attr('string') whyNoData!: string;
    @attr('string') whyNoPrereg!: string;

    @belongsTo('node', { inverse: 'preprints' })
    node!: AsyncBelongsTo<NodeModel> & NodeModel;

    @belongsTo('license', { inverse: null })
    license!: AsyncBelongsTo<LicenseModel> & LicenseModel;

    @belongsTo('file', { inverse: null })
    primaryFile?: AsyncBelongsTo<FileModel> & FileModel;

    @belongsTo('preprint-provider', { inverse: 'preprints' })
    provider!: AsyncBelongsTo<PreprintProviderModel> & PreprintProviderModel;

    @hasMany('review-action')
    reviewActions!: AsyncHasMany<ReviewActionModel>;

    @hasMany('files', { inverse: 'target'})
    files!: AsyncHasMany<FileModel> & FileModel;

    @hasMany('contributors', { inverse: 'preprint'})
    contributors!: AsyncHasMany<ContributorModel> & ContributorModel;

    @hasMany('contributor', { inverse: null })
    bibliographicContributors!: AsyncHasMany<ContributorModel>;

    @belongsTo('citation', { inverse: null })
    citation!: AsyncBelongsTo<CitationModel>;

    @hasMany('subject', { inverse: null})
    subjects!: AsyncHasMany<SubjectModel>;

    @hasMany('preprint-request', { inverse: 'target'})
    requests!: AsyncHasMany<PreprintRequestModel>;

    @hasMany('identifiers')
    identifiers!: AsyncHasMany<IdentifierModel>;

    @alias('links.doi') articleDoiUrl!: string | null;
    @alias('links.preprint_doi') preprintDoiUrl!: string;

    get isWithdrawn(): boolean{
        return this.dateWithdrawn !== null;
    }

    get userHasAdminPermission(): boolean{
        return true;
    }

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
