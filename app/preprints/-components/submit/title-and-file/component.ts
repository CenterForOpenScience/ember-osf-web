import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { action } from '@ember/object';
import { ValidationObject } from 'ember-changeset-validations';
import { validatePresence } from 'ember-changeset-validations/validators';
import buildChangeset from 'ember-osf-web/utils/build-changeset';

/**
 * The TitleAndFile Args
 */
interface TitleAndFileArgs {
    manager: PreprintStateMachine;
}

interface TitleAndFileFormForms {
    title: string;
    description: string;
}

const TitleAndFileFormValidation: ValidationObject<TitleAndFileFormForms> = {
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

    @action
    public validate(): void {
        this.titleAndFileFormChangeset.validate();
        if (this.titleAndFileFormChangeset.isInvalid) {
            return;
        }
        this.titleAndFileFormChangeset.execute();
        this.args.manager.validateTitleAndFile();
    }
}
