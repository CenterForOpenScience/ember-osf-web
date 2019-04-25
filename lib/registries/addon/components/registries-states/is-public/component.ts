import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Registration from 'ember-osf-web/models/registration';
import randomScientist from 'ember-osf-web/utils/random-scientist';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class RegistrationIsPublic extends Component.extend({
    submitWithdrawal: task(function *(this: RegistrationIsPublic) {
        if (!this.registration) {
            return;
        }

        this.registration.setProperties({
            pendingWithdrawal: true,
            withdrawalJustification: this.withdrawalJustification,
        });

        try {
            yield this.registration.save();
        } catch (e) {
            this.toast.error(this.i18n.t('registries.overview.withdraw.error'));
            throw e;
        }

        this.toast.success(this.i18n.t('registries.overview.withdraw.success'));

        if (this.closeDropdown) {
            this.closeDropdown();
        }
    }).drop(),
}) {
    @service i18n!: I18N;
    @service toast!: Toast;

    registration!: Registration;

    scientistName?: string;
    scientistNameInput?: string = '';
    withdrawalJustification?: string = '';
    closeDropdown?: () => void;

    didReceiveAttrs(this: RegistrationIsPublic) {
        this.setProperties({
            scientistNameInput: '',
            scientistName: randomScientist(),
        });
    }

    @computed(
        'submitWithdrawal.isRunning',
        'scientistNameInput',
        'scientistName',
    )
    get submitDisabled(this: RegistrationIsPublic): boolean {
        return this.submitWithdrawal.isRunning ||
            (this.scientistNameInput !== this.scientistName);
    }
}
