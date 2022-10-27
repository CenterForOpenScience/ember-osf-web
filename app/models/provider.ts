import { attr, hasMany, SyncHasMany, AsyncHasMany } from '@ember-data/model';

import LicenseModel from './license';
import ModeratorModel from './moderator';
import OsfModel from './osf-model';
import SubjectModel from './subject';

/* eslint-disable camelcase */

export interface Assets {
    favicon: string;
    powered_by_share: string;
    sharing: string;
    square_color_no_transparent: string;
    square_color_transparent: string;
    style: string;
    wide_black: string;
    wide_color: string;
    wide_white: string;
}

export enum ReviewPermissions {
    SetUpModeration = 'set_up_moderation',
    ViewSubmissions = 'view_submissions',
    AcceptSubmissions = 'accept_submissions',
    RejectSubmissions = 'reject_submissions',
    WithdrawSubmissions = 'withdraw_submissions',
    EditReviewComments = 'edit_review_comments',
    ViewActions = 'view_actions',
    AddModerator = 'add_moderator',
    UpdateModerator = 'update_moderator',
    RemoveModerator = 'remove_moderator',
    EditReviewSettings = 'edit_review_settings',
    AddReviewer = 'add_reviewer',
    AssignReviewer = 'assign_reviewer',
    ViewAssignedSubmissions = 'view_assigned_submissions',
    ReviewAssignedSubmissions = 'review_assigned_submissions',
}

/* eslint-enable camelcase */

export default abstract class ProviderModel extends OsfModel {
    @attr('fixstring') name!: string;
    @attr('fixstring') description!: string;
    @attr('string') advisoryBoard!: string;
    @attr('fixstring') example!: string;
    @attr('string') domain!: string;
    @attr('boolean') domainRedirectEnabled!: boolean;
    @attr('fixstring') footerLinks!: string;
    @attr('fixstring') emailSupport!: string;
    @attr('string') facebookAppId!: string;
    @attr('boolean') allowSubmissions!: boolean;
    @attr('boolean') allowCommenting!: boolean;
    @attr('boolean') allowUpdates!: boolean;
    @attr('array') permissions!: ReviewPermissions[];
    @attr('fixstring') reviewsWorkflow!: string | null;
    @attr('boolean') reviewsCommentsAnonymous!: boolean | null;
    @attr() assets?: Partial<Assets>; // TODO: camelize in transform

    @hasMany('subject', { inverse: null, async: false })
    subjects!: SyncHasMany<SubjectModel>;

    @hasMany('subject')
    highlightedSubjects!: AsyncHasMany<SubjectModel>;

    @hasMany('license', { inverse: null })
    licensesAcceptable!: AsyncHasMany<LicenseModel>;

    @hasMany('moderator', { inverse: 'provider' })
    moderators!: AsyncHasMany<ModeratorModel> | ModeratorModel[];

    get currentUserCanReview() {
        if (this.permissions) {
            return this.permissions.includes(ReviewPermissions.ViewSubmissions);
        }
        return false;
    }
}
