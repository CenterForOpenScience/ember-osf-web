import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Registration from 'ember-osf-web/models/registration';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import template from './template';

@layout(template)
export default class RegistrationIsEmbargoed extends Component {
    @service intl!: Intl;
    @service toast!: Toast;

    registration!: Registration;
    closeDropdown?: () => void;
    showModal? = false;

    @dropTask
    async endEmbargo() {
        if (!this.registration) {
            return;
        }

        this.registration.set('public', true);

        try {
            await this.registration.save();
        } catch (e) {
            const errorMessage = this.intl.t('registries.overview.embargo.action_error');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
        }

        this.toast.success(this.intl.t('registries.overview.embargo.action_success'));

        this.close();
    }

    @action
    close() {
        if (this.closeDropdown) {
            this.closeDropdown();
        }
    }
}
