import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { taskFor } from 'ember-concurrency-ts';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';

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
    @tracked isFileSelectDisplayed = false;
    @tracked isFileAttached = false;
    @tracked dragging = false;
    @tracked file!: any;

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
    public validate(file: any): void {
        this.file = file;
        this.isFileAttached = true;
        this.isFileSelectDisplayed = false;
        this.isFileUploadDisplayed = false;
        this.args.manager.validateFile(true);
    }

    @action
    public displayFileUpload(): void {
        this.isFileUploadDisplayed = true;
        this.isFileSelectDisplayed = false;
    }

    @action
    public displayFileSelect(): void {
        this.isFileUploadDisplayed = false;
        this.isFileSelectDisplayed = true;
    }

    public get isButtonDisabled(): boolean {
        return this.isFileSelectDisplayed || this.isFileUploadDisplayed;
    }

    @action
    public onCancelSelectAction(): void {
        this.isFileUploadDisplayed = false;
        this.isFileSelectDisplayed= false;
    }
}
