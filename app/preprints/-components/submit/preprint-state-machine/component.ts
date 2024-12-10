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
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import { Permission } from 'ember-osf-web/models/osf-model';
import { ReviewsState } from 'ember-osf-web/models/provider';
import { taskFor } from 'ember-concurrency-ts';
import InstitutionModel from 'ember-osf-web/models/institution';
import CurrentUserService from 'ember-osf-web/services/current-user';
import { ReviewActionTrigger } from 'ember-osf-web/models/review-action';

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
    newVersion?: boolean;
}

/**
 * The Preprint State Machine
 */
export default class PreprintStateMachine extends Component<StateMachineArgs>{
    @service store!: Store;
    @service router!: RouterService;
    @service intl!: Intl;
    @service toast!: Toast;
    @service currentUser!: CurrentUserService;

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
    @tracked tempVersion?: PreprintModel;
    displayAuthorAssertions = false;
    @tracked statusFlowIndex = 1;
    @tracked isEditFlow = false;
    @tracked displayFileUploadStep = true;
    @tracked isNewVersionFlow = this.args.newVersion;
    affiliatedInstitutions = [] as InstitutionModel[];

    constructor(owner: unknown, args: StateMachineArgs) {
        super(owner, args);

        if (this.args.newVersion) {
            // Create ephemeral preprint to prevent the original preprint from being overwritten
            // Also stores primary file for new version
            this.tempVersion = this.store.createRecord('preprint');
            this.preprint = this.args.preprint;
            return;
        }
        if (this.args.preprint) {
            this.preprint = this.args.preprint;
            this.setValidationForEditFlow();
            this.isEditFlow = true;
            if (this.args.preprint.reviewsState === ReviewsState.REJECTED) {
                this.displayFileUploadStep = true;
            } else {
                this.displayFileUploadStep = false;
            }
            this.isDeleteButtonDisplayed = false;
            taskFor(this.canDisplayWitdrawalButton).perform();
        } else {
            this.isDeleteButtonDisplayed = true;
            this.isWithdrawalButtonDisplayed = false;
            this.displayFileUploadStep = true;
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

        this.isWithdrawalButtonDisplayed = this.isAdmin() &&
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
    public async onCancel(): Promise<void> {
        await this.router.transitionTo('preprints.detail', this.provider.id, this.preprint.id);
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

        if (this.isNewVersionFlow) {
            try {
                const url = this.preprint.links.preprint_versions as string;
                if (url && this.tempVersion) {
                    const savedVersionData = await this.currentUser.authenticatedAJAX({
                        url,
                        type: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        data: JSON.stringify({
                            data: {
                                type: 'preprints',
                                attributes: {
                                    primary_file: (await this.tempVersion.primaryFile)?.get('id'),
                                },
                            },
                        }),
                    });
                    this.store.pushPayload('preprint', savedVersionData);
                    const storedPreprintRecord = this.store.peekRecord('preprint', savedVersionData.data.id);

                    if (this.provider.reviewsWorkflow) {
                        const reviewAction = this.store.createRecord('review-action', {
                            actionTrigger: ReviewActionTrigger.Submit,
                            target: storedPreprintRecord,
                        });
                        await reviewAction.save();
                    } else {
                        storedPreprintRecord.isPublished = true;
                        await storedPreprintRecord.save();
                    }
                    this.tempVersion.destroyRecord();
                    await this.preprint.reload(); // Refresh the original preprint as this is no longer latest version
                    this.router.transitionTo('preprints.detail', this.provider.id, storedPreprintRecord.id);
                }
            } catch (e) {
                // TODO: ENG-6640 handle error
                // eslint-disable-next-line no-console
                console.error(e);
            }
            return;
        }

        if (this.preprint.reviewsState === ReviewsState.ACCEPTED) {
            await this.preprint.save();
        } else if (this.provider.reviewsWorkflow) {
            const reviewAction = this.store.createRecord('review-action', {
                actionTrigger: ReviewActionTrigger.Submit,
                target: this.preprint,
            });
            await reviewAction.save();
        } else {
            this.preprint.isPublished = true;
            await this.preprint.save();
        }

        await this.preprint.reload();
        await this.router.transitionTo('preprints.detail', this.provider.id, this.preprint.id);
    }

    /**
     * Callback for the action-flow component
     */
    @task
    @waitFor
    public async onNext(): Promise<void> {
        if (this.isNewVersionFlow) {
            // no need to save original or new version on new version flow
            this.statusFlowIndex++;
            return;
        }

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
            if (this.displayFileUploadStep) {
                await this.preprint.files;
                this.isNextButtonDisabled = !this.fileValidation;
            } else {
                this.isNextButtonDisabled = !this.metadataValidation;
            }
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

            if (this.preprint.currentUserPermissions.includes(Permission.Write)) {
                try {
                    await this.preprint.updateM2MRelationship(
                        'affiliatedInstitutions',
                        this.affiliatedInstitutions,
                    );
                    await this.preprint.reload();
                } catch (e) {
                    // eslint-disable-next-line max-len
                    const errorMessage = this.intl.t('preprints.submit.step-metadata.institutions.save-institutions-error');
                    captureException(e, { errorMessage });
                    this.toast.error(getApiErrorMessage(e), errorMessage);
                    throw e;
                }
            }

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
        if (this.isNewVersionFlow) {
            if (type === PreprintStatusTypeEnum.file) {
                return 1;
            } else if (type === PreprintStatusTypeEnum.review) {
                return 2;
            } else {
                return 0;
            }
        }

        if (this.displayFileUploadStep) {
            if (type === PreprintStatusTypeEnum.titleAndAbstract) {
                return 1;
            } else if (type === PreprintStatusTypeEnum.file) {
                return 2;
            } else if (type === PreprintStatusTypeEnum.metadata) {
                return 3;
            } else if (type === PreprintStatusTypeEnum.authorAssertions) {
                return 4;
            } else if (type === PreprintStatusTypeEnum.supplements && this.displayAuthorAssertions) {
                return 5;
            } else if (type === PreprintStatusTypeEnum.supplements && !this.displayAuthorAssertions) {
                return 4;
            } else if (type === PreprintStatusTypeEnum.review && this.displayAuthorAssertions) {
                return 6;
            } else if (type === PreprintStatusTypeEnum.review && !this.displayAuthorAssertions) {
                return 5;
            } else {
                return 0;
            }
        } else {
            if (type === PreprintStatusTypeEnum.titleAndAbstract) {
                return 1;
            } else if (type === PreprintStatusTypeEnum.metadata) {
                return 2;
            } else if (type === PreprintStatusTypeEnum.authorAssertions) {
                return 3;
            } else if (type === PreprintStatusTypeEnum.supplements && this.displayAuthorAssertions) {
                return 4;
            } else if (type === PreprintStatusTypeEnum.supplements && !this.displayAuthorAssertions) {
                return 3;
            } else if (type === PreprintStatusTypeEnum.review && this.displayAuthorAssertions) {
                return 5;
            } else if (type === PreprintStatusTypeEnum.review && !this.displayAuthorAssertions) {
                return 4;
            } else {
                return 0;
            }
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
        if (this.isNewVersionFlow) {
            if (type === PreprintStatusTypeEnum.file) {
                return true;
            } else if (type === PreprintStatusTypeEnum.review) {
                return true;
            } else {
                return false;
            }
        }

        if (type === PreprintStatusTypeEnum.file) {
            return this.displayFileUploadStep;
        } else if (type === PreprintStatusTypeEnum.authorAssertions) {
            return this.displayAuthorAssertions;
        }
        return true;
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
        const target = (this.isNewVersionFlow ? this.tempVersion : this.preprint)  as PreprintModel;
        await file.copy(target, '/', 'osfstorage', {
            conflict: 'replace',
        });
        const theFiles = await target.files;
        const rootFolder = await theFiles.firstObject!.rootFolder;
        const primaryFile = await rootFolder!.files;
        target.set('primaryFile', primaryFile.lastObject);
    }

    @action
    public updateAffiliatedInstitution(institution: InstitutionModel): void {
        if (this.isInstitutionAffiliated(institution.id)) {
            this.affiliatedInstitutions.removeObject(institution);
        } else {
            this.affiliatedInstitutions.addObject(institution);
        }
    }

    private isInstitutionAffiliated(id: string): boolean {
        return this.affiliatedInstitutions.find(
            institution => institution.id === id,
        ) !== undefined;
    }

    @action
    public resetAffiliatedInstitutions(): void {
        this.affiliatedInstitutions.length = 0;
    }

    public isAdmin(): boolean {
        return this.preprint.currentUserPermissions?.includes(Permission.Admin);
    }

    public isElementDisabled(): boolean {
        return !this.isAdmin();
    }

    public isAffiliatedInstitutionsDisabled(): boolean {
        return !this.preprint.currentUserPermissions.includes(Permission.Write);
    }
}
