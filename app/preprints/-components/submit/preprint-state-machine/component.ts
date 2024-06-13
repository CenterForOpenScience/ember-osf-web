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
}

/**
 * The Preprint State Machine
 */
export default class PreprintStateMachine extends Component<StateMachineArgs>{
    @service store!: Store;
    @service router!: RouterService;
    @service intl!: Intl;
    titleAndAbstractValidation = false;
    fileValidation = false;
    metadataValidation = false;
    authorAssertionValidation = false;
    supplementValidation = false;
    @tracked isNextButtonDisabled = true;
    @tracked isPreviousButtonDisabled = true;

    provider = this.args.provider;
    @tracked preprint: PreprintModel;
    displayAuthorAssertions = false;
    @tracked statusFlowIndex = 1;

    constructor(owner: unknown, args: StateMachineArgs) {
        super(owner, args);

        if (this.args.preprint) {
            this.preprint = this.args.preprint;
            this.setValidationForEditFlow();
        } else {
            this.preprint = this.store.createRecord('preprint', {
                provider: this.provider,
            });
        }
        this.displayAuthorAssertions = this.provider.assertionsEnabled;
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
     * saveOnStep
     *
     * @description Abstracted method to save after each step
     */
    private async saveOnStep(): Promise<void> {
        await this.preprint.save();
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
    @action
    public onSubmit(): void {
        this.router.transitionTo('preprints.detail', this.provider.id, this.preprint.id);
    }

    /**
     * Callback for the action-flow component
     */
    @task
    @waitFor
    public async onNext(): Promise<void> {
        this.isNextButtonDisabled = true;
        if (this.statusFlowIndex === this.getTypeIndex(PreprintStatusTypeEnum.titleAndAbstract) &&
            this.titleAndAbstractValidation
        ) {
            await this.saveOnStep();
            await this.preprint.files;
            this.isNextButtonDisabled = !this.metadataValidation;
            return;
        } else if (this.statusFlowIndex === this.getTypeIndex(PreprintStatusTypeEnum.file) &&
            this.fileValidation
        ) {
            await this.saveOnStep();
            this.isNextButtonDisabled = !this.authorAssertionValidation;
            return;
        } else if (this.statusFlowIndex === this.getTypeIndex(PreprintStatusTypeEnum.metadata) &&
            this.metadataValidation
        ) {
            await this.saveOnStep();
            this.isNextButtonDisabled = !this.authorAssertionValidation;
            return;
        } else if (this.statusFlowIndex === this.getTypeIndex(PreprintStatusTypeEnum.authorAssertions) &&
            this.authorAssertionValidation
        ) {
            await this.saveOnStep();
            this.isNextButtonDisabled = !this.supplementValidation;
            return;
        } else if (this.statusFlowIndex === this.getTypeIndex(PreprintStatusTypeEnum.supplements) &&
            this.supplementValidation
        ) {
            await this.saveOnStep();
            return;
        }
    }

    /**
     * Callback for the action-flow component
     */
    @action
    public validateTitleAndAbstract(valid: boolean): void {
        this.titleAndAbstractValidation = valid;
        this.isNextButtonDisabled = !valid;
    }

    /**
     * Callback for the action-flow component
     */
    @action
    public validateFile(valid: boolean): void {
        this.fileValidation = valid;
        this.isNextButtonDisabled = !valid;
    }

    /**
     * Callback for the action-flow component
     */
    @action
    public validateMetadata(valid: boolean): void {
        this.metadataValidation = valid;
        this.isNextButtonDisabled = !valid;
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
    }

    /**
     * Callback for the action-flow component
     */
    @action
    public validateSupplements(valid: boolean): void {
        this.supplementValidation = valid;
        this.isNextButtonDisabled = !valid;
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
}
