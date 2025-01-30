import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { taskFor } from 'ember-concurrency-ts';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import FileModel from 'ember-osf-web/models/file';
import NodeModel from 'ember-osf-web/models/node';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

/**
 * The File Args
 */
interface FileArgs {
    manager: PreprintStateMachine;
}

/**
 * The File Component
 */
export default class PreprintFile extends Component<FileArgs>{
    @service intl!: Intl;

    @tracked isFileUploadDisplayed = false;
    @tracked isProjectSelectDisplayed = false;
    @tracked isFileSelectDisplayed = false;
    @tracked isFileAttached = false;
    @tracked isEdit = false;
    @tracked dragging = false;
    @tracked file!: any;
    @tracked selectedProjectNode!: NodeModel;

    constructor(owner: unknown, args: FileArgs) {
        super(owner, args);

        taskFor(this.loadFiles).perform();
    }

    @task
    @waitFor
    private async loadFiles()  {
        const file = await this.args.manager.preprint.primaryFile;
        if(file) {
            this.file = file;
            this.isFileAttached = true;
            this.isEdit = true;
            this.args.manager.validateFile(true);
        }
    }

    public get isSelectProjectButtonDisplayed(): boolean {
        return !this.args.manager.isEditFlow;
    }

    public get isSelectProjectButtonDisabled(): boolean {
        return this.isButtonDisabled || this.isEdit;
    }

    @action
    public async validate(file: FileModel): Promise<void> {
        this.isEdit = true;
        this.file = file;
        this.isFileAttached = true;
        this.isProjectSelectDisplayed = false;
        this.isFileUploadDisplayed = false;
        this.args.manager.validateFile(true);
    }

    @action
    public displayFileUpload(): void {
        this.isFileUploadDisplayed = true;
        this.isProjectSelectDisplayed = false;
        this.isFileSelectDisplayed = false;
    }

    @action
    public displayFileSelect(): void {
        this.isFileUploadDisplayed = false;
        this.isProjectSelectDisplayed = true;
        this.isFileSelectDisplayed = false;
    }

    public get isButtonDisabled(): boolean {
        return this.isProjectSelectDisplayed || this.isFileUploadDisplayed;
    }

    @action
    public addNewfile(): void {
        this.file = null;
        this.isFileAttached = false;
        this.isFileUploadDisplayed = false;
        this.isProjectSelectDisplayed = false;
        this.isFileSelectDisplayed = false;
        this.args.manager.validateFile(false);
    }

    @action
    public onCancelSelectAction(): void {
        this.isFileUploadDisplayed = false;
        this.isProjectSelectDisplayed = false;
    }

    @action
    public projectSelected(node: NodeModel): void {
        this.selectedProjectNode = node;
        this.isFileSelectDisplayed= true;
    }

    @task
    @waitFor
    async onSelectFile(file: FileModel): Promise<void> {
        await taskFor(this.args.manager.addProjectFile).perform(file);
        this.validate(file);
    }

    public get getSelectExplanationText(): string {
        return this.intl.t('preprints.submit.step-file.project-select-explanation',
            { singularPreprintWord: this.args.manager.provider.documentType.singularCapitalized });
    }

    public get getUploadText(): string {
        return this.intl.t('preprints.submit.step-file.upload-title',
            { singularPreprintWord: this.args.manager.provider.documentType.singularCapitalized });
    }
}
