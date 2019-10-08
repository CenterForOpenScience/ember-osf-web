import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Registration from 'ember-osf-web/models/registration';
import template from './template';

@layout(template)
export default class RegistrationIsEmbargoed extends Component {
    @service i18n!: I18N;
    @service toast!: Toast;

    @task
    endEmbargo = task(function *(this: RegistrationIsEmbargoed) {
        if (!this.registration) {
            return;
        }

        this.registration.set('public', true);

        try {
            yield this.registration.save();
        } catch (e) {
            this.toast.error(this.i18n.t('registries.overview.embargoed.action_error'));
        }

        this.toast.success(this.i18n.t('registries.overview.embargoed.action_success'));

        this.close();
    }).drop();

    registration!: Registration;
    closeDropdown?: () => void;
    showModal?: boolean = false;

    @action
    close() {
        if (this.closeDropdown) {
            this.closeDropdown();
        }
    }
}
