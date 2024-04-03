import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { action } from '@ember/object';
import { ValidationObject } from 'ember-changeset-validations';
import { validatePresence } from 'ember-changeset-validations/validators';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { SchemaBlock } from 'ember-osf-web/packages/registration-schema';
import { tracked } from '@glimmer/tracking';


/**
 * The Author Assertions Args
 */
interface AuthorAssertionsArgs {
    manager: PreprintStateMachine;
}

interface AuthorAssertionsForm {
    hasCoi: boolean;
    conflictOfInterestStatement: string;
}

const AuthorAssertionsFormValidation: ValidationObject<AuthorAssertionsForm> = {
    hasCoi: validatePresence({
        presence: true,
        ignoreBlank: true,
        type: 'empty',
    }),
    conflictOfInterestStatement: validatePresence({
        presence: true,
        ignoreBlank: true,
        type: 'empty',
    }),
};

/**
 * The Author Assertions Component
 */
export default class AuthorAssertions extends Component<AuthorAssertionsArgs>{
    @service intl!: Intl;
    @tracked isConflictOfInterestStatementDisabled = true;
    authorAssertionFormChangeset = buildChangeset(
        this.args.manager.preprint,
        AuthorAssertionsFormValidation,
    );

    optionBlockValues = [
        {
            registrationResponseKey: 'hasCoi',
            inputValue: true,
            displayText: this.intl.t('general.yes'),
        } as SchemaBlock,
        {
            registrationResponseKey: 'hasCoi',
            inputValue: false,
            displayText: this.intl.t('general.no'),
        } as SchemaBlock,
    ];

    public get displayCoiStatement(): boolean {
        return this.authorAssertionFormChangeset.get('hasCoi') !== undefined;
    }

    @action
    public async updateCoi(): Promise<void> {
        if (this.authorAssertionFormChangeset.get('hasCoi')) {
            await this.authorAssertionFormChangeset.set('conflictOfInterestStatement', '');
            this.isConflictOfInterestStatementDisabled = false;
        } else {
            this.isConflictOfInterestStatementDisabled = true;
            await this.authorAssertionFormChangeset.set('conflictOfInterestStatement',
                this.intl.t('preprints.submit.step-three.conflict-of-interest-none'));
        }

        this.validate();
    }

    @action
    public validate(): void {
        this.authorAssertionFormChangeset.validate();
        if (this.authorAssertionFormChangeset.isInvalid) {
            this.args.manager.validateAuthorAssertions(false);
            return;
        }
        this.authorAssertionFormChangeset.execute();
        this.args.manager.validateAuthorAssertions(true);
    }
}
