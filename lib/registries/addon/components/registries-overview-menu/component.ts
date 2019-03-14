import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import RegistrationModel, { RegistrationState } from 'ember-osf-web/models/registration';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class RegistriesOverviewMenu extends Component.extend({
    forkRegistration: task(function *(this: RegistriesOverviewMenu, closeDropdown: () => void) {
        if (!this.registration) {
            return;
        }

        closeDropdown();

        try {
            yield this.registration.makeFork();
        } catch (e) {
            this.toast.error(this.i18n.t('registries.overview.fork.error'));
            throw e;
        }

        this.toast.success(
            this.i18n.t('registries.overview.fork.success'),
            this.i18n.t('registries.overview.fork.success_title'),
        );
    }).drop(),
}) {
    @service store!: DS.Store;
    @service toast!: Toast;
    @service i18n!: I18N;

    registrationURL!: string;

    registration!: RegistrationModel;

    @computed('registration.state')
    get isWithdrawn(this: RegistriesOverviewMenu): boolean {
        return this.registration.state === RegistrationState.Withdrawn;
    }
}
