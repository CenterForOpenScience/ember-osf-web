import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Registration from 'ember-osf-web/models/registration';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import randomScientist from 'ember-osf-web/utils/random-scientist';

import { Changeset } from 'ember-changeset';
import lookupValidator, { ValidationObject } from 'ember-changeset-validations';
import { validateLength } from 'ember-changeset-validations/validators';
import { BufferedChangeset } from 'ember-changeset/types';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class RegistrationIsPublic extends Component {
    @service intl!: Intl;
    @service toast!: Toast;

    registration!: Registration;
    changeset!: BufferedChangeset;

    scientistName?: string;
    scientistNameInput?: string = '';
    closeDropdown!: () => void;
    showModal: boolean = false;

    changesetValidation: ValidationObject<Registration> = {
        withdrawalJustification: validateLength({
            allowBlank: true,
            max: 2048,
            type: 'tooLong',
            translationArgs: {
                description: this.intl.t('registries.overview.withdraw.withdrawal_justification'),
                max: 2048,
            },
        }),
    };

    @task({ withTestWaiter: true, drop: true })
    submitWithdrawal = task(function *(this: RegistrationIsPublic) {
        if (!this.registration) {
            return;
        }

        this.changeset.set('pendingWithdrawal', true);
        this.changeset.validate();
        if (this.changeset.isValid) {
            try {
                yield this.changeset.save({});
            } catch (e) {
                const errorMessage = this.intl.t('registries.overview.withdraw.error');
                captureException(e, { errorMessage });
                this.toast.error(getApiErrorMessage(e), errorMessage);
                throw e;
            }

            this.toast.success(this.intl.t('registries.overview.withdraw.success'));

            if (this.closeDropdown) {
                this.closeDropdown();
            }
        }
    });

    didReceiveAttrs() {
        this.changeset = Changeset(
            this.registration,
            lookupValidator(this.changesetValidation),
            this.changesetValidation,
        ) as BufferedChangeset;
        this.setProperties({
            scientistNameInput: '',
            scientistName: randomScientist(),
        });
    }

    @computed(
        'submitWithdrawal.isRunning',
        'scientistNameInput',
        'scientistName',
        'changeset.isInvalid',
    )
    get submitDisabled(): boolean {
        return this.submitWithdrawal.isRunning
            || (this.scientistNameInput !== this.scientistName)
            || this.changeset.isInvalid;
    }

    @action
    close() {
        if (this.changeset.isDirty) {
            this.changeset.rollback();
        }
        this.closeDropdown();
    }
}
