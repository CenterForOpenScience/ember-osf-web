import Controller from '@ember/controller';
// import { A } from '@ember/array';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
// import DS from 'ember-data';
// import loadAll from 'ember-osf/utils/load-relationship';
import config from 'ember-get-config';
// import permissions from 'ember-osf/const/permissions';
import Theme from 'ember-osf-web/services/theme';
import CurrentUserService from 'ember-osf-web/services/current-user';
import Features from 'ember-feature-flags';
import ContributorModel from 'ember-osf-web/models/contributor';
import SubjectModel from 'ember-osf-web/models/subject';


// const { PromiseArray } = DS;

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

    @computed('model')
    fileDownloadURL() {
        return fileDownloadPath(this.model.primaryFile, this.model);
    }

    @computed('model')
    facebookAppId() {
        return this.model.provider.facebookAppId ? this.model.provider.facebookAppId : config.FB_APP_ID;
    }

    @computed('node.links.html')
    supplementalMaterialDisplayLink(): string {
        return this.isChronosProvider.links.html.replace(/^https?:\/\//i, '');
    }

    @computed('model.provider.reviewsWorkflow')
    dateLabel(): string {
        return this.model.provider.reviewsWorkflow === PRE_MODERATION ?
            DATE_LABEL.submitted :
            DATE_LABEL.created;
    }

    @computed('model.provider.reviewsWorkflow')
    editButtonLabel(): string {
        const editPreprint = 'content.project_button.edit_preprint';
        const editResubmitPreprint = 'content.project_button.edit_resubmit_preprint';
        return this.model.provider.reviewsWorkflow === PRE_MODERATION
            && this.model.provider.reviewsWorkflow.reviewsState === REJECTED && this.isAdmin()
            ? editResubmitPreprint : editPreprint;
    }

    @computed('model.{currentUserPermissions,permissions}')
    isAdmin(): boolean{
        // True if the current user has admin permissions for the node that contains the preprint
        return (this.model.currentUserPermissions || []).includes(this.model.permissions.ADMIN);
    }

    @computed('model.contributors', 'isAdmin', 'currentUser.currentUserId')
    userIsContrib(): boolean {
        if (this.isAdmin()) {
            return true;
        } else if (this.model.contributors.length) {
            const authorIds = this.model.contributors.forEach((author: ContributorModel) => author.id);
            return this.currentUser.currentUserId ? authorIds.includes(this.currentUser.currentUserId) : false;
        }
        return false;
    }

    @computed('model.{public,provider.reviewsWorkflow,reviewsState}', 'userIsContrib', 'isPendingWithdrawal')
    showStatusBanner(): boolean {
        return (
            this.model.provider.reviewsWorkflow
            && this.model.public
            && this.userIsContrib()
            && this.model.reviewsState !== INITIAL
        ) || this.isPendingWithdrawal;
    }

    @computed('model.subjects')
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

    /*
    useShortenedDescription: computed('expandedAbstract', 'hasShortenedDescription', function() {
        return this.get('hasShortenedDescription') && !this.get('expandedAbstract');
    })
    */

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

    isChronosProvider(): boolean {
        const { chronosProviders } = config;
        return Array.isArray(chronosProviders) && chronosProviders.includes(this.model.provider.id);
    }
    /*

    actions: {
        toggleLicenseText() {
            const licenseState = this.toggleProperty('showLicenseText') ? 'Expand' : 'Contract';
            this.get('metrics')
                .trackEvent({
                    category: 'button',
                    action: 'click',
                    label: `Content - License ${licenseState}`,
                });
        },
        expandMFR() {
            // State of fullScreenMFR before the transition (what the user perceives as the action)
            const beforeState = this.toggleProperty('fullScreenMFR') ? 'Expand' : 'Contract';

            this.get('metrics')
                .trackEvent({
                    category: 'button',
                    action: 'click',
                    label: `Content - MFR ${beforeState}`,
                });
        },
        expandAbstract() {
            this.toggleProperty('expandedAbstract');
        },
        shareLink(href, category, action, label, extra) {
            const metrics = this.get('metrics');

            // TODO submit PR to ember-metrics for a trackSocial function for Google Analytics.
            // For now, we'll use trackEvent.
            metrics.trackEvent({
                category,
                action,
                label,
                extra,
            });

            if (label.includes('email')) { return; }

            window.open(href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=600,height=400');
            return false;
        },
        // Sends Event to GA.  Previously sent a second event to Keen to track non-contributor
        // downloads, but that functionality has been removed.  Stub left in place in case we want
        // to double-log later.
        trackNonContributors(category, label, url) {
            this.send('click', category, label, url);
        },
    },

    _returnContributors(contributors) {
        return contributors;
    },

    metricsStartDate = this.config.OSF.metricsStartDate;
    */
}
