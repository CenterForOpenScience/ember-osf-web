import Component from '@glimmer/component';
import PreprintModel, { PreprintDataLinksEnum, PreprintPreregLinksEnum } from 'ember-osf-web/models/preprint';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Intl from 'ember-intl/services/intl';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import FileModel from 'ember-osf-web/models/file';
import Toast from 'ember-toastr/services/toast';
import captureException from 'ember-osf-web/utils/capture-exception';
import { Permission } from 'ember-osf-web/models/osf-model';
import { ReviewsState } from 'ember-osf-web/models/provider';
import { taskFor } from 'ember-concurrency-ts';

export enum PreprintStatusTypeEnum {
    titleAndAbstract = 'titleAndAbstract',
    file = 'file',
    metadata = 'metadata',
    authorAssertions = 'authorAssertions',
    supplements = 'supplements',
    review = 'review',
}

/**
 * The State Machine Args
 */
interface StateMachineArgs {
    provider: PreprintProviderModel;
    preprint: PreprintModel;
    setPageDirty: () => void;
    resetPageDirty: () => void;
}

/**
 * The Preprint State Machine
 */
export default class PreprintStateMachine extends Component<StateMachineArgs>{
    @service store!: Store;
    @service router!: RouterService;
    @service intl!: Intl;
    @service toast!: Toast;
    titleAndAbstractValidation = false;
    fileValidation = false;
    metadataValidation = false;
    authorAssertionValidation = false;
    supplementValidation = false;
    @tracked isNextButtonDisabled = true;
    @tracked isPreviousButtonDisabled = true;
    @tracked isDeleteButtonDisplayed = false;
    @tracked isWithdrawalButtonDisplayed = false;

    provider = this.args.provider;
    @tracked preprint: PreprintModel;
    displayAuthorAssertions = false;
    @tracked statusFlowIndex = 1;
    @tracked isEditFlow = false;

    constructor(owner: unknown, args: StateMachineArgs) {
        super(owner, args);

        if (this.args.preprint) {
            this.preprint = this.args.preprint;
            this.setValidationForEditFlow();
            this.isEditFlow = true;
            this.isDeleteButtonDisplayed = false;
            taskFor(this.canDisplayWitdrawalButton).perform();
        } else {
            this.isDeleteButtonDisplayed = true;
            this.isWithdrawalButtonDisplayed = false;
            this.preprint = this.store.createRecord('preprint', {
                provider: this.provider,
            });
        }

        this.displayAuthorAssertions = this.provider.assertionsEnabled;
    }

    @task
    @waitFor
    private async canDisplayWitdrawalButton(): Promise<void> {
        let isWithdrawalRejected = false;

        const withdrawalRequests = await this.preprint.requests;
        const withdrawalRequest = withdrawalRequests.firstObject;
        if (withdrawalRequest) {
            const requestActions = await withdrawalRequest.queryHasMany('actions', {
                sort: '-modified',
            });

            const latestRequestAction = requestActions.firstObject;
            // @ts-ignore: ActionTrigger is never
            if (latestRequestAction && latestRequestAction.actionTrigger === 'reject') {
                isWithdrawalRejected = true;
            }
        }

        this.isWithdrawalButtonDisplayed = this.preprint.currentUserPermissions.includes(Permission.Admin) &&
        (this.preprint.reviewsState === ReviewsState.ACCEPTED ||
        this.preprint.reviewsState === ReviewsState.PENDING) && !isWithdrawalRejected;

    }

    private setValidationForEditFlow(): void {
        this.titleAndAbstractValidation = true;
        this.fileValidation = true;
        this.metadataValidation = true;
        this.authorAssertionValidation = true;
        this.supplementValidation = true;
        this.isNextButtonDisabled = false;
    }

    /**
     * Callback for the action-flow component
     */
    @task
    @waitFor
    public async onDelete(): Promise<void> {
        await this.preprint.deleteRecord();
        await this.router.transitionTo('preprints.discover', this.provider.id);
    }

    /**
     * Callback for the action-flow component
     */
    @task
    @waitFor
    public async onWithdrawal(): Promise<void> {
        try {
            const preprintRequest = await this.store.createRecord('preprint-request', {
                comment: this.preprint.withdrawalJustification,
                requestType: 'withdrawal',
                target: this.preprint,
            });

            await preprintRequest.save();

            this.toast.success(
                this.intl.t('preprints.submit.action-flow.success-withdrawal',
                    {
                        singularCapitalizedPreprintWord: this.provider.documentType.singularCapitalized,
                    }),
            );

            await this.router.transitionTo('preprints.detail', this.provider.id, this.preprint.id);
        } catch (e) {
            const errorMessage = this.intl.t('preprints.submit.action-flow.error-withdrawal',
                {
                    singularPreprintWord: this.provider.documentType.singular,
                });
            this.toast.error(errorMessage);
            captureException(e, { errorMessage });
        }
    }


    /**
     * saveOnStep
     *
     * @description Abstracted method to save after each step
     */
    private async saveOnStep(): Promise<void> {
        try {
            await this.preprint.save();
            this.toast.success(
                this.intl.t('preprints.submit.action-flow.success',
                    {
                        singularPreprintWord: this.provider.documentType.singular,
                    }),
            );
        } catch (e) {
            const errorMessage = this.intl.t('preprints.submit.action-flow.error',
                {
                    singularPreprintWord: this.provider.documentType.singular,
                });
            this.toast.error(errorMessage);
            captureException(e, { errorMessage });
        }
        this.statusFlowIndex++;
        this.determinePreviousButtonState();
    }

    /**
     * determinePreviousButtonState
     *
     * @description Abstracted method to determine the state of the previous button
     *
     * @returns void
     */
    private determinePreviousButtonState(): void {
        this.isPreviousButtonDisabled = this.statusFlowIndex === 1;
    }

    /**
     * Callback for the action-flow component
     */
    @task
    @waitFor
    public async onSubmit(): Promise<void> {
        this.args.resetPageDirty();
        if (!this.isEditFlow) {
            if (this.provider.reviewsWorkflow) {
                const reviewAction = this.store.createRecord('review-action', {
                    actionTrigger: 'submit',
                    target: this.preprint,
                });
                await reviewAction.save();
            } else {
                this.preprint.isPublished = true;
                await this.preprint.save();
            }
        }

        await this.router.transitionTo('preprints.detail', this.provider.id, this.preprint.id);
    }

    /**
     * Callback for the action-flow component
     */
    @task
    @waitFor
    public async onNext(): Promise<void> {
        if (this.isEditFlow) {
            this.args.resetPageDirty();
        } else {
            this.args.setPageDirty();
        }
        this.isNextButtonDisabled = true;

        if (
            this.statusFlowIndex === this.getTypeIndex(PreprintStatusTypeEnum.titleAndAbstract) &&
            this.titleAndAbstractValidation
        ) {
            await this.saveOnStep();
            await this.preprint.files;
            this.isNextButtonDisabled = !this.fileValidation;
            return;
        } else if (
            this.statusFlowIndex === this.getTypeIndex(PreprintStatusTypeEnum.file) &&
            this.fileValidation
        ) {
            await this.saveOnStep();
            this.isNextButtonDisabled = !this.metadataValidation;
            return;
        } else if (
            this.statusFlowIndex === this.getTypeIndex(PreprintStatusTypeEnum.metadata) &&
            this.metadataValidation
        ) {
            await this.saveOnStep();
            if (this.displayAuthorAssertions) {
                this.isNextButtonDisabled = !this.authorAssertionValidation;
            } else {
                this.isNextButtonDisabled = !this.supplementValidation;
            }
            return;
        } else if (
            this.statusFlowIndex === this.getTypeIndex(PreprintStatusTypeEnum.authorAssertions) &&
            this.authorAssertionValidation
        ) {
            await this.saveOnStep();
            this.isNextButtonDisabled = !this.supplementValidation;
            return;
        } else if (
            this.statusFlowIndex === this.getTypeIndex(PreprintStatusTypeEnum.supplements) &&
            this.supplementValidation
        ) {
            await this.saveOnStep();
            return;
        }
    }

    private setPageDirty(): void {
        if (this.isEditFlow) {
            this.args.setPageDirty();
        }
    }

    /**
     * Callback for the action-flow component
     */
    @action
    public validateTitleAndAbstract(valid: boolean): void {
        this.titleAndAbstractValidation = valid;
        this.isNextButtonDisabled = !valid;
        this.setPageDirty();
    }

    /**
     * Callback for the action-flow component
     */
    @action
    public validateFile(valid: boolean): void {
        this.fileValidation = valid;
        this.isNextButtonDisabled = !valid;
        this.setPageDirty();
    }

    /**
     * Callback for the action-flow component
     */
    @action
    public validateMetadata(valid: boolean): void {
        this.metadataValidation = valid;
        this.isNextButtonDisabled = !valid;
        this.setPageDirty();
    }

    /**
     * Callback for the action-flow component
     */
    @action
    public validateAuthorAssertions(valid: boolean): void {
        if (this.preprint.hasCoi === false) {
            this.preprint.conflictOfInterestStatement = null;
        }
        if (this.preprint.hasDataLinks === PreprintDataLinksEnum.NOT_APPLICABLE) {
            this.preprint.whyNoData = null;
        }
        if (this.preprint.hasPreregLinks === PreprintPreregLinksEnum.NOT_APPLICABLE) {
            this.preprint.whyNoPrereg = null;
        }
        this.authorAssertionValidation = valid;
        this.isNextButtonDisabled = !valid;
        this.setPageDirty();
    }

    /**
     * Callback for the action-flow component
     */
    @action
    public validateSupplements(valid: boolean): void {
        this.supplementValidation = valid;
        this.isNextButtonDisabled = !valid;
        this.setPageDirty();
    }

    @action
    public onPrevious(): void {
        if (this.statusFlowIndex > 1) {
            this.statusFlowIndex--;
        }
        this.determinePreviousButtonState();
        this.isNextButtonDisabled = false;
    }

    @action
    public onClickStep(type: string): void {
        this.isNextButtonDisabled = !this.isFinished(type);
        if (
            type === PreprintStatusTypeEnum.titleAndAbstract &&
            this.statusFlowIndex > this.getTypeIndex(type)
        ) {
            this.statusFlowIndex = this.getTypeIndex(type);
        } else if (
            type === PreprintStatusTypeEnum.file &&
            this.statusFlowIndex > this.getTypeIndex(type)
        ) {
            this.statusFlowIndex = this.getTypeIndex(type);
        } else if (
            type === PreprintStatusTypeEnum.metadata &&
            this.statusFlowIndex > this.getTypeIndex(type)
        ) {
            this.statusFlowIndex = this.getTypeIndex(type);
        } else if (
            type === PreprintStatusTypeEnum.authorAssertions &&
            this.statusFlowIndex > this.getTypeIndex(type) &&
            this.displayAuthorAssertions
        ) {
            this.statusFlowIndex = this.getTypeIndex(type);
        } else if (
            type === PreprintStatusTypeEnum.supplements &&
            this.statusFlowIndex > this.getTypeIndex(type)
        ) {
            this.statusFlowIndex = this.getTypeIndex(type);
        } else if (
            type === PreprintStatusTypeEnum.review &&
            this.statusFlowIndex > this.getTypeIndex(type)
        ) {
            this.statusFlowIndex = this.getTypeIndex(type);
        }

        this.determinePreviousButtonState();
    }

    @action
    public isSelected(type: string): boolean {
        if (
            type === PreprintStatusTypeEnum.titleAndAbstract &&
            this.getTypeIndex(type) === this.statusFlowIndex
        ) {
            return true;
        } else if (
            type === PreprintStatusTypeEnum.file &&
            this.getTypeIndex(type) === this.statusFlowIndex
        ) {
            return true;
        } else if (
            type === PreprintStatusTypeEnum.metadata &&
            this.getTypeIndex(type) === this.statusFlowIndex
        ) {
            return true;
        } else if (
            type === PreprintStatusTypeEnum.authorAssertions &&
            this.getTypeIndex(type) === this.statusFlowIndex &&
            this.displayAuthorAssertions
        ) {
            return true;
        } else if (
            type === PreprintStatusTypeEnum.supplements &&
            this.getTypeIndex(type) === this.statusFlowIndex
        ) {
            return true;
        } else if (
            type === PreprintStatusTypeEnum.review &&
            this.getTypeIndex(type) === this.statusFlowIndex
        ) {
            return true;
        } else {
            return false;
        }
    }

    @action
    public getAnalytics(type: string): string {
        return this.intl.t('preprints.submit.data-analytics', {statusType: this.getStatusTitle(type)  } );
    }


    @action
    public isDisabled(type: string): boolean {
        if (
            type === PreprintStatusTypeEnum.titleAndAbstract &&
            this.getTypeIndex(type) === this.statusFlowIndex
        ) {
            return true;
        } else if (
            type === PreprintStatusTypeEnum.file &&
            this.getTypeIndex(type) === this.statusFlowIndex
        ) {
            return true;
        } else if (
            type === PreprintStatusTypeEnum.metadata &&
            this.getTypeIndex(type) === this.statusFlowIndex
        ) {
            return true;
        } else if (
            type === PreprintStatusTypeEnum.authorAssertions &&
            this.getTypeIndex(type) === this.statusFlowIndex &&
            this.displayAuthorAssertions
        ) {
            return true;
        } else if (
            type === PreprintStatusTypeEnum.supplements &&
            this.getTypeIndex(type) === this.statusFlowIndex
        ) {
            return true;
        } else if (
            type === PreprintStatusTypeEnum.review &&
            this.getTypeIndex(type) === this.statusFlowIndex
        ) {
            return true;
        } else {
            return false;
        }
    }

    private getTypeIndex(type: string): number {
        if (type === PreprintStatusTypeEnum.titleAndAbstract) {
            return 1;
        } else if (type === PreprintStatusTypeEnum.file) {
            return 2;
        } else if (type === PreprintStatusTypeEnum.metadata) {
            return 3;
        } else if (type === PreprintStatusTypeEnum.authorAssertions) {
            return 4;
        } else if (type === PreprintStatusTypeEnum.supplements &&  this.displayAuthorAssertions) {
            return 5;
        }  else if (type === PreprintStatusTypeEnum.supplements &&  !this.displayAuthorAssertions) {
            return 4;
        } else if (type === PreprintStatusTypeEnum.review &&  this.displayAuthorAssertions) {
            return 6;
        }  else if (type === PreprintStatusTypeEnum.review &&  !this.displayAuthorAssertions) {
            return 5;
        } else {
            return 0;
        }
    }

    @action
    public isFinished(type: string): boolean {
        if (this.displayAuthorAssertions && this.statusFlowIndex > this.getTypeIndex(type)) {
            return true;
        } else if (!this.displayAuthorAssertions && this.statusFlowIndex > this.getTypeIndex(type)) {
            return true;
        } else if (this.statusFlowIndex > this.getTypeIndex(type)) {
            return true;
        } else {
            return false;
        }
    }

    @action
    public getStatusTitle(type: string): string {
        switch (type) {
        case PreprintStatusTypeEnum.titleAndAbstract:
            return this.intl.t('preprints.submit.status-flow.step-title-and-abstract');
        case PreprintStatusTypeEnum.file:
            return this.intl.t('preprints.submit.status-flow.step-file');
        case PreprintStatusTypeEnum.metadata:
            return this.intl.t('preprints.submit.status-flow.step-metadata');
        case PreprintStatusTypeEnum.authorAssertions:
            return this.intl.t('preprints.submit.status-flow.step-author-assertions');
        case PreprintStatusTypeEnum.supplements:
            return this.intl.t('preprints.submit.status-flow.step-supplements');
        case PreprintStatusTypeEnum.review:
            return this.intl.t('preprints.submit.status-flow.step-review');
        default:
            return '';
        }
    }

    @action
    public getFaIcon(type: string): string {
        if (this.isSelected(type)) {
            return 'dot-circle';
        } else if (this.isFinished(type)) {
            return 'check-circle';
        } else {
            return 'circle';
        }
    }

    /**
     * shoulddisplayStatusType
     *
     * @description Determines if the status type should be displayed
     *
     * @returns boolean
     */
    public shouldDisplayStatusType(type: string): boolean{
        return type === PreprintStatusTypeEnum.authorAssertions ? this.displayAuthorAssertions : true;
    }

    /**
     * getTitleAndAbstractType
     *
     * @description Provides the enum type to limit strings in the hbs files
     *
     * @returns strings
     */
    public get getTitleAndAbstractType(): string {
        return PreprintStatusTypeEnum.titleAndAbstract;
    }

    /**
     * getFileType
     *
     * @description Provides the enum type to limit strings in the hbs files
     *
     * @returns strings
     */
    public get getFileType(): string {
        return PreprintStatusTypeEnum.file;
    }

    /**
     * getMetadataType
     *
     * @description Provides the enum type to limit strings in the hbs files
     *
     * @returns strings
     */
    public get getMetadataType(): string {
        return PreprintStatusTypeEnum.metadata;
    }

    /**
     * getAuthorAssertionsType
     *
     * @description Provides the enum type to limit strings in the hbs files
     *
     * @returns strings
     */
    public get getAuthorAssertionsType(): string {
        return PreprintStatusTypeEnum.authorAssertions;
    }

    /**
     * getSupplementsType
     *
     * @description Provides the enum type to limit strings in the hbs files
     *
     * @returns strings
     */
    public get getSupplementsType(): string {
        return PreprintStatusTypeEnum.supplements;
    }

    /**
     * getReviewType
     *
     * @description Provides the enum type to limit strings in the hbs files
     *
     * @returns strings
     */
    public get getReviewType(): string {
        return PreprintStatusTypeEnum.review;
    }

    @task
    @waitFor
    public async addProjectFile(file: FileModel): Promise<void>{
        await file.copy(this.preprint, '/', 'osfstorage', {
            conflict: 'replace',
        });
        const theFiles = await this.preprint.files;
        const rootFolder = await theFiles.firstObject!.rootFolder;
        const primaryFile = await rootFolder!.files;
        this.preprint.set('primaryFile', primaryFile.lastObject);
    }
}
