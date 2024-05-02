import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { action } from '@ember/object';
import { ValidationObject } from 'ember-changeset-validations';
import { validatePresence } from 'ember-changeset-validations/validators';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { tracked } from '@glimmer/tracking';

/**
 * The TitleAndFile Args
 */
interface TitleAndFileArgs {
    manager: PreprintStateMachine;
}

interface TitleAndFileForm {
    title: string;
    description: string;
}

const TitleAndFileFormValidation: ValidationObject<TitleAndFileForm> = {
    title: validatePresence({
        presence: true,
        ignoreBlank: true,
        type: 'empty',
    }),
    description: validatePresence({
        presence: true,
        ignoreBlank: true,
        type: 'empty',
    }),
};

/**
 * The Title And File Component
 */
export default class TitleAndFile extends Component<TitleAndFileArgs>{
    titleAndFileFormChangeset = buildChangeset(this.args.manager.preprint, TitleAndFileFormValidation);
    @tracked isFileUploadDisplayed = false;
    @tracked isFileSelectDisplayed = false;
    @tracked dragging = false;

    @action
    public validate(): void {
        this.titleAndFileFormChangeset.validate();
        if (this.titleAndFileFormChangeset.isInvalid) {
            this.args.manager.validateTitleAndFile(false);
            return;
        }
        this.titleAndFileFormChangeset.execute();
        this.args.manager.validateTitleAndFile(true);
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
