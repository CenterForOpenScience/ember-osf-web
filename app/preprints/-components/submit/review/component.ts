import Store from '@ember-data/store';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import moment from 'moment-timezone';
import Intl from 'ember-intl/services/intl';
import { PreprintProviderReviewsWorkFlow } from 'ember-osf-web/models/provider';
import { SafeString } from '@ember/template/-private/handlebars';

/**
 * The Review Args
 */
interface ReviewArgs {
    manager: PreprintStateMachine;
}

/**
 * The Review Component
 */
export default class Review extends Component<ReviewArgs>{
    @service store!: Store;
    @tracked preprint = this.args.manager.preprint;
    @tracked provider?: any;
    @tracked license?: any;
    @tracked contributors?: any;
    @tracked subjects?: any;
    @service intl!: Intl;
    @tracked displayProviderAgreement = false;
    @tracked providerAgreement: string | SafeString = '';

    constructor(owner: unknown, args: ReviewArgs) {
        super(owner, args);

        taskFor(this.loadPreprint).perform();
    }

    @task
    @waitFor
    private async loadPreprint()  {
        this.provider = await this.preprint.provider.content;
        if (
            this.provider.reviewsWorkflow === PreprintProviderReviewsWorkFlow.PRE_MODERATION ||
            this.provider.reviewsWorkflow === PreprintProviderReviewsWorkFlow.POST_MODERATION
        ) {
            this.displayProviderAgreement = true;

            const moderationType = this.provider.reviewsWorkflow ===
                PreprintProviderReviewsWorkFlow.PRE_MODERATION ?
                PreprintProviderReviewsWorkFlow.PRE_MODERATION :
                PreprintProviderReviewsWorkFlow.POST_MODERATION;
            this.providerAgreement = this.intl.t('preprints.submit.step-review.agreement-provider',
                {
                    providerName : this.provider.name,
                    moderationType,
                    htmlSafe: true,
                });
        }

        this.license = this.preprint.license;
        this.subjects = await this.preprint.queryHasMany('subjects');
    }

    public get providerLogo(): string | undefined {
        return this.provider.get('assets')?.square_color_no_transparent;
    }

    public  get displayPublicationDoi(): string {
        return this.preprint.articleDoiUrl || this.intl.t('general.not-applicable');
    }

    public  get displayPublicationDate(): string {
        return this.preprint.originalPublicationDate
            ? moment(this.preprint.originalPublicationDate).format('YYYY-MM-DD')
            : this.intl.t('general.not-applicable');
    }

    public  get displayPublicationCitation(): string {
        return this.preprint.customPublicationCitation
            ? this.preprint.customPublicationCitation
            : this.intl.t('general.not-applicable');
    }

    public get providerServiceLabel(): string {
        return this.intl.t('preprints.submit.step-review.preprint-service',
            { singularPreprintWord: this.provider.documentType.singularCapitalized });
    }
}
