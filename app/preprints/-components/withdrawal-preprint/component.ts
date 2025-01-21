import Component from '@glimmer/component';
import { ValidationObject } from 'ember-changeset-validations';
import { validateLength } from 'ember-changeset-validations/validators';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { waitFor } from '@ember/test-waiters';
import { Task, task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import config from 'ember-osf-web/config/environment';
import { PreprintProviderReviewsWorkFlow, ReviewsState } from 'ember-osf-web/models/provider';
import { SafeString } from '@ember/template/-private/handlebars';
import PreprintModel from 'ember-osf-web/models/preprint';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';

const { support: { supportEmail } } = config;

interface WithdrawalModalArgs {
    preprint: PreprintModel;
    provider: PreprintProviderModel;
    onWithdrawal: Task<void, []>;
}

interface WithdrawalFormFields {
    withdrawalJustification: string;
}


export default class WithdrawalComponent extends Component<WithdrawalModalArgs> {
    @service intl!: Intl;
    @tracked isInvalid = true;

    withdrawalFormValidations: ValidationObject<WithdrawalFormFields> = {
        withdrawalJustification: validateLength({
            min: 25,
            type: 'greaterThanOrEqualTo',
            translationArgs: {
                description: this.intl.t('preprints.submit.action-flow.withdrawal-placeholder'),
                gte: this.intl.t('preprints.submit.action-flow.withdrawal-input-error'),
            },
        }),
    };

    withdrawalFormChangeset = buildChangeset(this.args.preprint, this.withdrawalFormValidations);

    /**
     * Calls the state machine delete method
     */
    @task
    @waitFor
    public async onWithdrawal(): Promise<void> {
        this.validate();
        if (this.withdrawalFormChangeset.isInvalid) {
            return Promise.reject();
        }
        this.withdrawalFormChangeset.execute();
        return taskFor(this.args.onWithdrawal).perform();
    }

    @action
    public validate(): void {
        this.withdrawalFormChangeset.validate();
        this.isInvalid = this.withdrawalFormChangeset.isInvalid;
    }

    /**
     * internationalize the withdrawal label
     */
    public get commentLabel(): string {
        return this.intl.t('preprints.submit.action-flow.withdrawal-label');
    }

    /**
     * internationalize the modal title
     */
    public get modalTitle(): string {
        return this.intl.t('preprints.submit.action-flow.withdrawal-modal-title',
            { singularPreprintWord: this.args.provider.documentType.singularCapitalized});
    }

    /**
     * internationalize the modal explanation
     */
    public get modalExplanation(): SafeString {
        if (this.args.provider.reviewsWorkflow === PreprintProviderReviewsWorkFlow.PRE_MODERATION
            && this.args.preprint.reviewsState === ReviewsState.PENDING
        ) {
            return this.intl.t('preprints.submit.action-flow.pre-moderation-notice-pending',
                {
                    singularPreprintWord: this.args.provider.documentType.singular,
                    htmlSafe: true,
                }) as SafeString;
        } else if (this.args.provider.reviewsWorkflow === PreprintProviderReviewsWorkFlow.PRE_MODERATION
        ) {
            return this.intl.t('preprints.submit.action-flow.pre-moderation-notice-accepted',
                {
                    singularPreprintWord: this.args.provider.documentType.singular,
                    pluralCapitalizedPreprintWord: this.args.provider.documentType.pluralCapitalized,
                    htmlSafe: true,
                }) as SafeString;
        } else if (this.args.provider.reviewsWorkflow === PreprintProviderReviewsWorkFlow.POST_MODERATION) {
            return this.intl.t('preprints.submit.action-flow.post-moderation-notice',
                {
                    singularPreprintWord: this.args.provider.documentType.singular,
                    pluralCapitalizedPreprintWord: this.args.provider.documentType.pluralCapitalized,
                    htmlSafe: true,
                }) as SafeString;
        } else {
            return this.intl.t('preprints.submit.action-flow.no-moderation-notice',
                {
                    singularPreprintWord: this.args.provider.documentType.singular,
                    pluralCapitalizedPreprintWord: this.args.provider.documentType.pluralCapitalized,
                    supportEmail,
                    htmlSafe: true,
                }) as SafeString;
        }
    }
}
