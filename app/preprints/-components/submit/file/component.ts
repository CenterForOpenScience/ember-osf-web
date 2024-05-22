import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { action } from '@ember/object';
import { ValidationObject } from 'ember-changeset-validations';
import { validatePresence } from 'ember-changeset-validations/validators';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import FileModel from 'ember-osf-web/models/file';
import { tracked } from '@glimmer/tracking';

/**
 * The File Args
 */
interface FileArgs {
    manager: PreprintStateMachine;
}

interface FileForm {
    file: FileModel;
}

const FileFormValidation: ValidationObject<FileForm> = {
    file: validatePresence({
        presence: true,
        ignoreBlank: true,
        type: 'empty',
    }),
};

/**
 * The File Component
 */
export default class PreprintFile extends Component<FileArgs>{
    fileFormChangeset = buildChangeset(this.args.manager.preprint, FileFormValidation);
    @tracked isFileUploadDisplayed = false;
    @tracked isFileSelectDisplayed = false;
    @tracked dragging = false;

    @action
    public validate(): void {
        this.fileFormChangeset.validate();
        if (this.fileFormChangeset.isInvalid) {
            this.args.manager.validateFile(false);
            return;
        }
        this.fileFormChangeset.execute();
        this.args.manager.validateFile(true);
    }

    @action
    public displayFileUpload(): void {
        this.isFileUploadDisplayed = true;
        this.isFileSelectDisplayed= false;
    }

    @action
    public displayFileSelect(): void {
        this.isFileUploadDisplayed = false;
        this.isFileSelectDisplayed= true;
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
