import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { action } from '@ember/object';
import { ValidationObject } from 'ember-changeset-validations';
import { validatePresence } from 'ember-changeset-validations/validators';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
// import { tracked } from '@glimmer/tracking';

/**
 * The TitleAndAbstract Args
 */
interface TitleAndAbstractArgs {
    manager: PreprintStateMachine;
}

interface TitleAndAbstractForm {
    title: string;
    description: string;
}

const TitleAndAbstractFormValidation: ValidationObject<TitleAndAbstractForm> = {
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
 * The Title And Abstract Component
 */
export default class TitleAndAbstract extends Component<TitleAndAbstractArgs>{
    titleAndAbstractFormChangeset = buildChangeset(this.args.manager.preprint, TitleAndAbstractFormValidation);
    // @tracked isFileUploadDisplayed = false;
    // @tracked isFileSelectDisplayed = false;
    // @tracked dragging = false;

    @action
    public validate(): void {
        this.titleAndAbstractFormChangeset.validate();
        if (this.titleAndAbstractFormChangeset.isInvalid) {
            this.args.manager.validateTitleAndAbstract(false);
            return;
        }
        this.titleAndAbstractFormChangeset.execute();
        this.args.manager.validateTitleAndAbstract(true);
    }

    // @action
    // public displayFileUpload(): void {
    //     this.isFileUploadDisplayed = true;
    //     this.isFileSelectDisplayed= false;
    // }

    // @action
    // public displayFileSelect(): void {
    //     this.isFileUploadDisplayed = false;
    //     this.isFileSelectDisplayed= true;
    // }

    // public get isButtonDisabled(): boolean {
    //     return this.isFileSelectDisplayed || this.isFileUploadDisplayed;
    // }

    // @action
    // public onCancelSelectAction(): void {
    //     this.isFileUploadDisplayed = false;
    //     this.isFileSelectDisplayed= false;
    // }
}
