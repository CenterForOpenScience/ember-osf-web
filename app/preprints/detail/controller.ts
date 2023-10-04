import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';
import Theme from 'ember-osf-web/services/theme';
import CurrentUserService from 'ember-osf-web/services/current-user';
import Features from 'ember-feature-flags';
import ContributorModel from 'ember-osf-web/models/contributor';
import SubjectModel from 'ember-osf-web/models/subject';
import Intl from 'ember-intl/services/intl';
import { Permission } from 'ember-osf-web/models/osf-model';
import { ReviewsState, ReviewsWorkFlow } from 'ember-osf-web/models/provider';
import { tracked } from '@glimmer/tracking';
import { extractDoi } from 'ember-osf-web/utils/doi';
import Media from 'ember-responsive';


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

    // metricsStartDate = config.OSF.metricsStartDate;

    queryParams_Altered = {
        chosenFile: 'file',
    };

    @tracked fullScreenMFR = false;
    @tracked showLicenseText = false;
    @tracked expandedAbstract =  navigator.userAgent.includes('Prerender');


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
        return this.model.provider.reviewsWorkflow === ReviewsWorkFlow.PRE_MODERATION ?
            DATE_LABEL.submitted :
            DATE_LABEL.created;
    }

    get editButtonLabel(): string {
        const editPreprint = 'preprints.detail.project_button.edit_preprint';
        const editResubmitPreprint = 'preprints.detail.project_button.edit_resubmit_preprint';
        // eslint-disable-next-line max-len
        const translation = this.model.provider.reviewsWorkflow === ReviewsWorkFlow.PRE_MODERATION
            && this.model.preprint.reviewsState === ReviewsState.REJECTED && this.isAdmin()
            ? editResubmitPreprint : editPreprint;
        return this.intl.t(translation, {
            documentType: this.model.provider.documentType.singular,
        });
    }

    private isAdmin(): boolean {
        // True if the current user has admin permissions for the node that contains the preprint
        return (this.model.preprint.currentUserPermissions).includes(Permission.Admin);
    }

    get userIsContrib(): boolean {
        // console.log(1);
        if (this.isAdmin()) {
            // console.log(2);
            return true;
        } else if (this.model.contributors.length) {
            // console.log(3);
            const authorIds = [] as string[];
            this.model.contributors.forEach((author: ContributorModel) => {
            // console.log(4);
                authorIds.push(author.id);
            });
            // eslint-disable-next-line max-len
            // console.log(5, this.currentUser.currentUserId ? authorIds.includes(this.currentUser.currentUserId) : false);
            return this.currentUser.currentUserId ? authorIds.includes(this.currentUser.currentUserId) : false;
        }
        // console.log(6);
        return false;
    }

    get showStatusBanner(): boolean {
        // console.log('detail controller');
        /* console.log('detail controller - condition',
            this.model.provider.reviewsWorkflow
            && this.model.preprint.public
            && this.userIsContrib
            && this.model.preprint.reviewsState !== ReviewsState.PENDING);
            */
        // console.log('detail controller - reviewsWorkFlow', this.model.provider.reviewsWorkflow);
        // console.log('detail controller - public', this.model.preprint.public);
        // console.log('detail controller - userIsContrib', this.userIsContrib);
        // console.log('detail controller - reviewState', this.model.preprint.reviewsState !== ReviewsState.PENDING);
        return (
            this.model.provider.reviewsWorkflow
            && this.model.preprint.public
            && this.userIsContrib
            && this.model.preprint.reviewsState !== ReviewsState.PENDING
        );
    }

    get disciplineReduced(): [] {
        // Preprint disciplines are displayed in collapsed form on content page
        return this.model.subjects.reduce((acc: SubjectModel[], val: SubjectModel) => acc.concat(val), []).uniqBy('id');
    }

    get authors(): ContributorModel[] {
        return this.model.contributors;
    }

    get preprintDoi(): string {
        return extractDoi(this.model.preprint.preprintDoiUrl) || '';
    }

    get articleDoi(): string {
        return extractDoi(this.model.preprint.articleDoiUrl) || '';
    }

    @action
    toggleLicenseText(): void {
        this.showLicenseText = !this.showLicenseText;
    }

    get hasShortenedDescription(): String {
        return this.model.preprint.description && this.model.preprint.description.length > 350;
    }

    get useShortenedDescription(): boolean {
        return this.hasShortenedDescription && !this.expandedAbstract;
    }

    /**
     * description
     *
     * @description Get a shortened version of the abstract, but doesn't cut in the middle of word
     *      by going to the last space.
     * @returns string
     */
    get description(): string {
        if (this.useShortenedDescription) {
            return this.model.preprint.description
                .slice(0, 350)
                .replace(/\s+\S*$/, '');
        } else {
            return this.model.preprint.description;
        }
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
    expandAbstract() {
        this.expandedAbstract = !this.expandedAbstract;
    }

    @action
    trackNonContributors(category: string, label: string, url: string): void {
        this.send('click', category, label, url);
    }

    get isMobile() {
        return this.media.isMobile;
    }
}
