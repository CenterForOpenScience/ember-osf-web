import { attr, belongsTo, hasMany, AsyncBelongsTo, AsyncHasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

import getRelatedHref from 'ember-osf-web/utils/get-related-href';

import AbstractNodeModel from 'ember-osf-web/models/abstract-node';
import CitationModel from 'ember-osf-web/models/citation';
import PreprintRequestModel from 'ember-osf-web/models/preprint-request';
import { ReviewsState } from 'ember-osf-web/models/provider';
import ReviewActionModel from 'ember-osf-web/models/review-action';
import InstitutionModel from 'ember-osf-web/models/institution';
import { extractDoi } from 'ember-osf-web/utils/doi';

import ContributorModel from './contributor';
import FileModel from './file';
import IdentifierModel from './identifier';
import LicenseModel from './license';
import NodeModel from './node';
import { Permission } from './osf-model';
import PreprintProviderModel from './preprint-provider';
import SubjectModel from './subject';

export enum PreprintDataLinksEnum {
    AVAILABLE = 'available',
    NO = 'no',
    NOT_APPLICABLE = 'not_applicable',
}

export enum PreprintPreregLinksEnum {
    AVAILABLE = 'available',
    NO = 'no',
    NOT_APPLICABLE = 'not_applicable',
}

export enum PreprintPreregLinkInfoEnum {
    PREREG_EMPTY = '',
    PREREG_DESIGNS = 'prereg_designs',
    PREREG_ANALYSIS = 'prereg_analysis',
    PREREG_BOTH = 'prereg_both',
}

export const VersionStatusSimpleLabelKey = {
    [ReviewsState.PENDING]: 'preprints.detail.version_status.pending',
    [ReviewsState.REJECTED]: 'preprints.detail.version_status.rejected',
    [ReviewsState.WITHDRAWN]: 'preprints.detail.version_status.withdrawn',
};

export interface PreprintLicenseRecordModel {
    copyright_holders: string[];
    year: string;
}

export default class PreprintModel extends AbstractNodeModel {
    @attr('fixstring') title!: string;
    @attr('date') dateCreated!: Date;
    @attr('date') datePublished!: Date;
    @attr('date') dateWithdrawn!: Date;
    @attr('date') originalPublicationDate!: Date | null;
    @attr('fixstring') customPublicationCitation!: string | null;
    @attr('date') dateModified!: Date;
    @attr('fixstring') doi!: string | null;
    @attr('boolean') public!: boolean;
    @attr('boolean') isPublished!: boolean;
    @attr('boolean') isPreprintOrphan!: boolean;
    @attr('object') licenseRecord!: PreprintLicenseRecordModel;
    @attr('string') reviewsState!: ReviewsState;
    @attr('string') description!: string;
    @attr('date') dateLastTransitioned!: Date;
    @attr('date') preprintDoiCreated!: Date;
    @attr('array') currentUserPermissions!: Permission[];
    @attr('fixstringarray') tags!: string[];
    @attr('fixstring') withdrawalJustification!: string;
    @attr('boolean') hasCoi!: boolean;
    @attr('string') hasDataLinks!: PreprintDataLinksEnum;
    @attr('string') hasPreregLinks!: PreprintPreregLinksEnum;
    @attr('string') conflictOfInterestStatement!: string | null;
    @attr('array') dataLinks!: string[];
    @attr('array') preregLinks!: string[];
    @attr('string') whyNoData!: string | null;
    @attr('string') whyNoPrereg!: string | null;
    @attr('string') preregLinkInfo!: PreprintPreregLinkInfoEnum;
    @attr('number') version!: number;
    @attr('boolean') isLatestVersion!: boolean;

    @belongsTo('node', { inverse: 'preprints' })
    node!: AsyncBelongsTo<NodeModel> & NodeModel;

    @belongsTo('license', { inverse: null })
    license!: AsyncBelongsTo<LicenseModel> & LicenseModel;

    @belongsTo('file', { inverse: null })
    primaryFile?: AsyncBelongsTo<FileModel> & FileModel;

    @belongsTo('preprint-provider', { inverse: 'preprints' })
    provider!: AsyncBelongsTo<PreprintProviderModel> & PreprintProviderModel;

    @hasMany('institution')
    affiliatedInstitutions!: AsyncHasMany<InstitutionModel>;

    @hasMany('review-action')
    reviewActions!: AsyncHasMany<ReviewActionModel>;

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

    @hasMany('preprint', { inverse: null })
    versions!: AsyncHasMany<PreprintModel>;

    @alias('links.doi') articleDoiUrl!: string | null;
    @alias('links.preprint_doi') preprintDoiUrl!: string;

    get isWithdrawn(): boolean{
        return this.dateWithdrawn !== null;
    }

    get extractedDoi(): string {
        return extractDoi(this.preprintDoiUrl) || '';
    }

    @computed('license', 'licenseRecord')
    get licenseText(): string {
        const text = this.license.get('text') || '';
        const { year = '', copyright_holders = [] } = this.licenseRecord;

        return text
            .replace(/({{year}})/g, year)
            .replace(/({{copyrightHolders}})/g, copyright_holders.join(', '));
    }

    get currentUserIsAdmin(): boolean {
        return this.currentUserPermissions.includes(Permission.Admin);
    }

    get canCreateNewVersion(): boolean {
        return this.currentUserIsAdmin && this.datePublished && this.isLatestVersion;
    }

    makeNewVersion(): Promise<PreprintModel> {
        const url = getRelatedHref(this.links.relationships!.versions);
        return this.currentUser.authenticatedAJAX({
            url,
            type: 'POST',
        });
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        preprint: PreprintModel;
    } // eslint-disable-line semi
}
