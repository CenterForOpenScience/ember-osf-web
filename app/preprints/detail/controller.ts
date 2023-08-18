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

    @computed('model.currentUserPermissions')
    isAdmin(): boolean{
        // True if the current user has admin permissions for the node that contains the preprint
        return (this.model.currentUserPermissions || []).includes(permissions.ADMIN);
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

    /*
    disciplineReduced: computed('model.subjects', function() {
        // Preprint disciplines are displayed in collapsed form on content page
        return this.get('model.subjects').reduce((acc, val) => acc.concat(val), []).uniqBy('id');
    }),
    /* eslint-disable ember/named-functions-in-promises * /
    authors: computed('model', function() {
        // Cannot be called until node has loaded!
        const model = this.get('model');
        const contributors = A();
        return PromiseArray.create({
            promise: loadAll(model, 'contributors', contributors)
                .then(() => contributors),
        });
    }),
    /* eslint-enable ember/named-functions-in-promises * /
    fullLicenseText: computed('model.{license.text,licenseRecord}', function() {
        const text = this.get('model.license.text') || '';
        // eslint-disable-line camelcase
        const { year = '', copyright_holders = [] } = this.get('model.licenseRecord');
        return text
            .replace(/({{year}})/g, year)
            .replace(/({{copyrightHolders}})/g, copyright_holders.join(', '));
    }),

    hasShortenedDescription: computed('model.description', function() {
        const description = this.get('model.description');

        return description && description.length > 350;
    }),

    useShortenedDescription: computed('expandedAbstract', 'hasShortenedDescription', function() {
        return this.get('hasShortenedDescription') && !this.get('expandedAbstract');
    }),

    description: computed('model.description', function() {
        // Get a shortened version of the abstract, but doesn't cut in the middle of word by going
        // to the last space.
        return this.get('model.description')
            .slice(0, 350)
            .replace(/\s+\S*$/, '');
    }),

    emailHref: computed('model', function() {
        const titleEncoded = encodeURIComponent(this.get('model.title'));
        const hrefEncoded = encodeURIComponent(window.location.href);
        return `mailto:?subject=${titleEncoded}&body=${hrefEncoded}`;
    }),

    isChronosProvider: computed('model.provider.id', function() {
        const { chronosProviders } = config;
        return Array.isArray(chronosProviders) && chronosProviders.includes(this.get('model.provider.id'));
    }),

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
