import { tracked } from '@glimmer/tracking';
import { getOwner } from '@ember/application';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Store from '@ember-data/store';

import { task } from 'ember-concurrency';
import Features from 'ember-feature-flags';
import Intl from 'ember-intl/services/intl';
import Media from 'ember-responsive';
import Toast from 'ember-toastr/services/toast';

import config from 'ember-osf-web/config/environment';
import ContributorModel from 'ember-osf-web/models/contributor';
import { Permission } from 'ember-osf-web/models/osf-model';
import { ReviewsState, PreprintProviderReviewsWorkFlow } from 'ember-osf-web/models/provider';
import CurrentUserService from 'ember-osf-web/services/current-user';
import Theme from 'ember-osf-web/services/theme';
import { VersionStatusSimpleLabelKey } from 'ember-osf-web/models/preprint';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';


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
    @service store!: Store;
    @service theme!: Theme;
    @service currentUser!: CurrentUserService;
    @service features!: Features;
    @service intl!: Intl;
    @service media!: Media;
    @service toast!: Toast;
    @service router!: RouterService;

    @tracked fullScreenMFR = false;
    @tracked plauditIsReady = false;

    metricsStartDate = config.OSF.metricsStartDate;
    reviewStateLabelKeyMap = VersionStatusSimpleLabelKey;

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

    get showEditButton() {
        const providerIsPremod = this.model.provider.reviewsWorkflow === PreprintProviderReviewsWorkFlow.PRE_MODERATION;
        const preprintIsRejected = this.model.preprint.reviewsState === ReviewsState.REJECTED;
        const preprintIsFirstVersion = this.model.preprint.version === 1;

        if (!this.userIsContrib) {
            return false;
        }

        if (this.model.preprint.isWithdrawn) {
            return false;
        }

        if (this.model.preprint.isLatestVersion || this.model.preprint.reviewsState === ReviewsState.INITIAL) {
            return true;
        }
        if (providerIsPremod) {
            if (this.model.preprint.reviewsState === ReviewsState.PENDING) {
                return true;
            }
            // Edit and resubmit
            if (preprintIsFirstVersion && preprintIsRejected
                && this.model.preprint.currentUserIsAdmin) {
                return true;
            }
        }
        return false;
    }
    get editButtonLabel(): string {
        const providerIsPremod = this.model.provider.reviewsWorkflow === PreprintProviderReviewsWorkFlow.PRE_MODERATION;
        const preprintIsRejected = this.model.preprint.reviewsState === ReviewsState.REJECTED;

        const editPreprint = 'preprints.detail.edit_preprint';
        const editResubmitPreprint = 'preprints.detail.edit_resubmit_preprint';
        const translation = providerIsPremod && preprintIsRejected && this.model.preprint.currentUserIsAdmin
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

    private hasReadWriteAccess(): boolean {
        // True if the current user has write permissions for the node that contains the preprint
        return (this.model.preprint.currentUserPermissions.includes(Permission.Write));
    }


    get userIsContrib(): boolean {
        if (this.model.preprint.currentUserIsAdmin) {
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

    @task
    @waitFor
    async createNewVersion() {
        try {
            const url = this.model.preprint.links.preprint_versions as string;
            const newVersion = await this.currentUser.authenticatedAJAX({
                url,
                type: 'POST',
            });
            this.transitionToRoute('preprints.new-version', this.model.provider.id, newVersion.data.id);
        } catch (e) {
            const errorTitle = this.intl.t('preprints.submit.new-version.error.title');
            const errorMessage = getApiErrorMessage(e);
            captureException(e, { errorMessage });
            this.toast.error(errorMessage, errorTitle);
        }
    }

    /**
     * Callback for the action-flow component
     */
    @task
    @waitFor
    public async onWithdrawal(): Promise<void> {
        try {
            const preprintRequest = await this.store.createRecord('preprint-request', {
                comment: this.model.preprint.withdrawalJustification,
                requestType: 'withdrawal',
                target: this.model.preprint,
            });

            await preprintRequest.save();

            this.toast.success(
                this.intl.t('preprints.submit.action-flow.success-withdrawal',
                    {
                        singularCapitalizedPreprintWord: this.model.provider.documentType.singularCapitalized,
                    }),
            );

            const { currentRouteName } = this.router;
            getOwner(this).lookup(`route:${currentRouteName}`).refresh();
        } catch (e) {
            const errorMessage = this.intl.t('preprints.submit.action-flow.error-withdrawal',
                {
                    singularPreprintWord: this.model.provider.documentType.singular,
                });
            this.toast.error(errorMessage);
            captureException(e, { errorMessage });
        }
    }

    get isMobile() {
        return this.media.isMobile;
    }
}
