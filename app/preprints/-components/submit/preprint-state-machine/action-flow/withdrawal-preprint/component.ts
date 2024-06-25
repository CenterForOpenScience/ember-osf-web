import Component from '@glimmer/component';
import { ValidationObject } from 'ember-changeset-validations';
import { validateLength } from 'ember-changeset-validations/validators';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

interface WithdrawalModalArgs {
    manager: PreprintStateMachine;
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

    withdrawalFormChangeset = buildChangeset(this.args.manager.preprint, this.withdrawalFormValidations);

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
        return taskFor(this.args.manager.onWithdrawal).perform();
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
        return this.intl.t('preprints.submit.action-flow.withdrawal-label',
            { singularPreprintWord: this.args.manager.provider.documentType.singularCapitalized});
    }

    /**
     * internationalize the delete modal title
     */
    public get modalTitle(): string {
        return this.intl.t('preprints.submit.action-flow.withdrawal-modal-title',
            { singularPreprintWord: this.args.manager.provider.documentType.singularCapitalized});
    }

    /**
     * internationalize the delete modal body
     */
    public get modalBody(): string {
        return this.intl.t('preprints.submit.action-flow.withdrawal-modal-body',
            { singularPreprintWord: this.args.manager.provider.documentType.singularCapitalized});
    }
}
