import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';
import Theme from 'ember-osf-web/services/theme';
import CurrentUserService from 'ember-osf-web/services/current-user';
import Features from 'ember-feature-flags';
import ContributorModel from 'ember-osf-web/models/contributor';
import SubjectModel from 'ember-osf-web/models/subject';


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
    created: 'content.date_label.created_on',
    submitted: 'content.date_label.submitted_on',
};
const PRE_MODERATION = 'pre-moderation';
const REJECTED = 'rejected';
const INITIAL = 'initial';

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

    // metricsStartDate = config.OSF.metricsStartDate;

    queryParams_Altered = {
        chosenFile: 'file',
    };

    fullScreenMFR = false;
    expandedAuthors = true;
    showLicenseText = false;
    primaryFile = null;
    showModalClaimUser = false;
    isPendingWithdrawal = false;
    isWithdrawn = null;
    isPlauditReady = false;
    expandedAbstract =  navigator.userAgent.includes('Prerender');


    get hyperlink(): string {
        return window.location.href;
    }

    fileDownloadURL() {
        // return fileDownloadPath(this.model.primaryFile, this.model);
    }

    facebookAppId(): string {
        return this.model.provider.facebookAppId ? this.model.provider.facebookAppId : config.FB_APP_ID;
    }

    dateLabel(): string {
        return this.model.provider.reviewsWorkflow === PRE_MODERATION ?
            DATE_LABEL.submitted :
            DATE_LABEL.created;
    }

    editButtonLabel(): string {
        const editPreprint = 'content.project_button.edit_preprint';
        const editResubmitPreprint = 'content.project_button.edit_resubmit_preprint';
        return this.model.provider.reviewsWorkflow === PRE_MODERATION
            && this.model.provider.reviewsWorkflow.reviewsState === REJECTED && this.isAdmin()
            ? editResubmitPreprint : editPreprint;
    }

    isAdmin(): boolean {
        // True if the current user has admin permissions for the node that contains the preprint
        return (this.model.currentUserPermissions || []).includes(this.model.permissions.ADMIN);
    }

    userIsContrib(): boolean {
        if (this.isAdmin()) {
            return true;
        } else if (this.model.contributors.length) {
            const authorIds = this.model.contributors.forEach((author: ContributorModel) => author.id);
            return this.currentUser.currentUserId ? authorIds.includes(this.currentUser.currentUserId) : false;
        }
        return false;
    }

    showStatusBanner(): boolean {
        return (
            this.model.provider.reviewsWorkflow
            && this.model.public
            && this.userIsContrib()
            && this.model.reviewsState !== INITIAL
        ) || this.isPendingWithdrawal;
    }

    disciplineReduced(): [] {
        // Preprint disciplines are displayed in collapsed form on content page
        return this.model.subjects.reduce((acc: SubjectModel[], val: SubjectModel) => acc.concat(val), []).uniqBy('id');
    }

    authors(): ContributorModel[] {
        return this.model.contributors;
    }

    fullLicenseText(): string {
        return this.model.licenseRecord;
    }

    hasShortenedDescription(): String {
        return this.model.description && this.model.description.length > 350;
    }

    useShortenedDescription(): boolean {
        return this.hasShortenedDescription() && !this.expandedAbstract;
    }

    /**
     * description
     *
     * @description Get a shortened version of the abstract, but doesn't cut in the middle of word
     *      by going to the last space.
     * @returns string
     */
    description(): string {
        return this.model.description
            .slice(0, 350)
            .replace(/\s+\S*$/, '');
    }

    emailHref(): string {
        const titleEncoded = encodeURIComponent(this.model.title);
        const hrefEncoded = encodeURIComponent(window.location.href);
        return `mailto:?subject=${titleEncoded}&body=${hrefEncoded}`;
    }


    @action
    toggleLicenseText(): void {
        this.showLicenseText = !this.showLicenseText;
        /*
         this.get('metrics')
                .trackEvent({
                    category: 'button',
                    action: 'click',
                    label: `Content - License ${licenseState}`,
                });
                */
    }

    @action
    expandMFR() {
        // State of fullScreenMFR before the transition (what the user perceives as the action)
        this.fullScreenMFR = !this.fullScreenMFR;

        /*
        this.get('metrics')
            .trackEvent({
                category: 'button',
                action: 'click',
                label: `Content - MFR ${beforeState}`,
            });
            */
    }

    @action
    expandAbstract() {
        this.expandedAbstract = !this.expandedAbstract;
    }

    @action
    trackNonContributors(category: string, label: string, url: string): void {
        this.send('click', category, label, url);
    }
}
