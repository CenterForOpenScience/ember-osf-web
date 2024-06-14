import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { taskFor } from 'ember-concurrency-ts';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import FileModel from 'ember-osf-web/models/file';
import NodeModel from 'ember-osf-web/models/node';

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
    @tracked isFileUploadDisplayed = false;
    @tracked isProjectSelectDisplayed = false;
    @tracked isFileSelectDisplayed = false;
    @tracked isFileAttached = false;
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
        }
    }

    @action
    public async validate(file: FileModel): Promise<void> {
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
}
