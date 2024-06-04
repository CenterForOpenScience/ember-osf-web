import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { action } from '@ember/object';
import { ValidationObject } from 'ember-changeset-validations';
import { validatePresence } from 'ember-changeset-validations/validators';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { tracked } from '@glimmer/tracking';
import { RadioButtonOption } from 'osf-components/components/form-controls/radio-button-group/component';
import { PreprintDataLinksEnum, PreprintPreregLinksEnum } from 'ember-osf-web/models/preprint';


/**
 * The Author Assertions Args
 */
interface AuthorAssertionsArgs {
    manager: PreprintStateMachine;
}

interface AuthorAssertionsForm {
    hasCoi: boolean;
    conflictOfInterestStatement: string;
    hasDataLinks: string;
    whyNoData: string;
    dataLinks: string[];
    hasPreregLinks: string;
    whyNoPrereg: string;
    preregLinks: string[];
    preregLinkInfo: PreprintPreregLinksEnum;
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
    hasDataLinks: validatePresence({
        presence: true,
        ignoreBlank: true,
        type: 'empty',
    }),
    whyNoData: [(key: string, newValue: string, oldValue: string, changes: any, content: any) => {
        if (changes['hasDataLinks'] !== PreprintDataLinksEnum.AVAILABLE &&
        content['hasDataLinks'] !== PreprintDataLinksEnum.AVAILABLE)  {
            return validatePresence({
                presence: true,
                ignoreBlank: true,
                type: 'empty',
            })(key, newValue, oldValue, changes, content);
        }
        return true;
    }],
    dataLinks: [(_key: string, newValue: string[], _oldValue: string[], changes: any, _content: any) => {
        if (changes['hasDataLinks'] === PreprintDataLinksEnum.AVAILABLE || newValue) {
            let isValid = false;
            if (newValue) {
                isValid = true;
                newValue.map((link: string) => {
                    isValid = isValid && (typeof link === 'string' && link.length > 0);
                });
            }

            return isValid ? true : {
                context: {
                    type: 'empty',
                },
            };
        } else {
            return true;
        }
    }],
    hasPreregLinks: validatePresence({
        presence: true,
        ignoreBlank: true,
        type: 'empty',
    }),
    whyNoPrereg: [(key: string, newValue: string, oldValue: string, changes: any, content: any) => {
        if (
            changes['hasPreregLinks'] !== PreprintPreregLinksEnum.AVAILABLE &&
            content['hasPreregLinks'] !== PreprintPreregLinksEnum.AVAILABLE
        ) {
            return validatePresence({
                presence: true,
                ignoreBlank: true,
                type: 'empty',
            })(key, newValue, oldValue, changes, content);
        }
        return true;
    }],
    preregLinks: [(_key: string, newValue: string[], _oldValue: string[], changes: any, _content: any) => {
        if (changes['hasPreregLinks'] === PreprintPreregLinksEnum.AVAILABLE || newValue) {
            let isValid = false;
            if (newValue) {
                isValid = true;
                newValue.map((link: string) => {
                    isValid = isValid && (typeof link === 'string' && link.length > 0);
                });
            }

            return isValid ? true : {
                context: {
                    type: 'empty',
                },
            };
        } else {
            return true;
        }
    }],
    preregLinkInfo: [(key: string, newValue: string, oldValue: string, changes: any, content: any) => {
        if (changes['hasPreregLinks'] === PreprintPreregLinksEnum.AVAILABLE || newValue) {
            return validatePresence({
                presence: true,
                ignoreBlank: false,
                type: 'empty',
            })(key, newValue, oldValue, changes, content);
        } else {
            return true;
        }
    }],
};

/**
 * The Public Data Component
 */
export default class PublicData extends Component<AuthorAssertionsArgs>{
    @service intl!: Intl;
    @tracked isConflictOfInterestStatementDisabled = false;
    @tracked isPublicDataStatementDisabled = true;
    authorAssertionFormChangeset = buildChangeset(
        this.args.manager.preprint,
        AuthorAssertionsFormValidation,
    );

    coiOptions= [
        {
            inputValue: true,
            displayText: this.intl.t('general.yes'),
        } as RadioButtonOption,
        {
            inputValue: false,
            displayText: this.intl.t('general.no'),
        } as RadioButtonOption,
    ];

    constructor(owner: unknown, args: AuthorAssertionsArgs) {
        super(owner, args);

        if(this.args.manager.preprint.hasDataLinks === PreprintDataLinksEnum.NOT_APPLICABLE) {
            this.authorAssertionFormChangeset.set('whyNoData',
                this.intl.t('preprints.submit.step-assertions.public-data-na-placeholder',
                    { singularPreprintWord: this.args.manager.provider.documentType.singular}));
        }

        if(this.args.manager.preprint.hasPreregLinks === PreprintPreregLinksEnum.NOT_APPLICABLE) {
            this.authorAssertionFormChangeset.set('whyNoPrereg',
                this.intl.t('preprints.submit.step-assertions.public-preregistration-na-placeholder',
                    { singularPreprintWord: this.args.manager.provider.documentType.singular}));
        }

        if (this.args.manager.preprint.hasCoi === false) {
            this.authorAssertionFormChangeset.set('conflictOfInterestStatement',
                this.intl.t('preprints.submit.step-assertions.conflict-of-interest-none'));
        } else {
            this.isConflictOfInterestStatementDisabled = false;
        }
    }

    @action
    public updateCoi(): void {
        if (this.authorAssertionFormChangeset.get('hasCoi')) {
            this.authorAssertionFormChangeset.set('conflictOfInterestStatement', null);
            this.isConflictOfInterestStatementDisabled = false;
        } else {
            this.authorAssertionFormChangeset.set('conflictOfInterestStatement',
                this.intl.t('preprints.submit.step-assertions.conflict-of-interest-none'));
            this.isConflictOfInterestStatementDisabled = true;
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
