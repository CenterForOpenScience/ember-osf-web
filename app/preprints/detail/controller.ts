import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import Features from 'ember-feature-flags';
import Intl from 'ember-intl/services/intl';
import Media from 'ember-responsive';

import config from 'ember-osf-web/config/environment';
import ContributorModel from 'ember-osf-web/models/contributor';
import { Permission } from 'ember-osf-web/models/osf-model';
import { ReviewsState, PreprintProviderReviewsWorkFlow } from 'ember-osf-web/models/provider';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUserService from 'ember-osf-web/services/current-user';
import Theme from 'ember-osf-web/services/theme';


/**
 * Takes an object with query parameter name as the key and value,
 * or [value, maxLength] as the values.
 *
 * @method queryStringify
 * @param queryParams {!object}
 * @param queryParams.key {!array|!string}
 * @param queryParams.key[0] {!string}
 * @param queryParams.key[1] {int}
 * @return {string}
 */

const DATE_LABEL = {
    created: 'preprints.detail.date_label.created_on',
    submitted: 'preprints.detail.date_label.submitted_on',
};

/**
 * @module ember-preprints
 * @submodule controllers
 */

/**
 * @class Content Controller
 */
export default class PrePrintsDetailController extends Controller {
    @service theme!: Theme;
    @service currentUser!: CurrentUserService;
    @service features!: Features;
    @service intl!: Intl;
    @service media!: Media;
    @service analytics!: Analytics;

    @tracked fullScreenMFR = false;
    @tracked plauditIsReady = false;

    metricsStartDate = config.OSF.metricsStartDate;

    get hyperlink(): string {
        return window.location.href;
    }

    get fileDownloadUrl(): string {
        const version = this.model.primaryFile.version;
        const path = `${this.model.preprint.id}/download/?`;
        return `${config.OSF.url}${path}${version ? `version=${version}` : ''}`.replace(/[&?]$/, '');
    }

    get facebookAppId(): string {
        return this.model.provider.facebookAppId ? this.model.provider.facebookAppId : config.FB_APP_ID;
    }

    get dateLabel(): string {
        return this.model.provider.reviewsWorkflow === PreprintProviderReviewsWorkFlow.PRE_MODERATION ?
            DATE_LABEL.submitted :
            DATE_LABEL.created;
    }

    get editButtonLabel(): string {
        const editPreprint = 'preprints.detail.project_button.edit_preprint';
        const editResubmitPreprint = 'preprints.detail.project_button.edit_resubmit_preprint';
        const translation = this.model.provider.reviewsWorkflow === PreprintProviderReviewsWorkFlow.PRE_MODERATION
            && this.model.preprint.reviewsState === ReviewsState.REJECTED && this.isAdmin()
            ? editResubmitPreprint : editPreprint;
        return this.intl.t(translation, {
            documentType: this.model.provider.documentType.singular,
        });
    }

    get displayTitle(): string {
        if (this.model.preprint.isWithdrawn) {
            return this.intl.t('preprints.detail.withdrawn_title', {
                title: this.model.preprint.title,
            });
        }
        return this.model.preprint.title;
    }

    private isAdmin(): boolean {
        // True if the current user has admin permissions for the node that contains the preprint
        return (this.model.preprint.currentUserPermissions).includes(Permission.Admin);
    }

    private hasReadWriteAccess(): boolean {
        // True if the current user has write permissions for the node that contains the preprint
        return (this.model.preprint.currentUserPermissions.includes(Permission.Write));
    }


    get userIsContrib(): boolean {
        if (this.isAdmin()) {
            return true;
        } else if (this.model.contributors.length) {
            const authorIds = [] as string[];
            this.model.contributors.forEach((author: ContributorModel) => {
                authorIds.push(author.id);
            });
            const authorId = `${this.model.preprint.id}-${this.currentUser.currentUserId}`;
            return this.currentUser.currentUserId ? authorIds.includes(authorId) && this.hasReadWriteAccess() : false;
        }
        return false;
    }

    get showStatusBanner(): boolean {
        return (
            this.model.provider.reviewsWorkflow
            && this.model.preprint.public
            && this.userIsContrib
            && this.model.preprint.reviewsState !== ReviewsState.INITIAL
            && !this.model.preprint.isPreprintOrphan
        );
    }

    get authors(): ContributorModel[] {
        return this.model.contributors;
    }

    emailHref(): string {
        const titleEncoded = encodeURIComponent(this.model.title);
        const hrefEncoded = encodeURIComponent(window.location.href);
        return `mailto:?subject=${titleEncoded}&body=${hrefEncoded}`;
    }

    @action
    expandMFR() {
        this.fullScreenMFR = !this.fullScreenMFR;
    }

    @action
    trackNonContributors(category: string, label: string, url: string): void {
        this.send('click', category, label, url);
    }

    get isMobile() {
        return this.media.isMobile;
    }

    @action
    trackDownload(): void {
        const { preprint } = this.model;
        this.analytics.trackDownload(preprint.id, preprint.verifiedDoi);
    }
}
