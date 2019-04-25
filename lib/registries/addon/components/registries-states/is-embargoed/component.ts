import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Registration from 'ember-osf-web/models/registration';
import template from './template';

@layout(template)
export default class RegistrationIsEmbargoed extends Component.extend({
    endEmbargo: task(function *(this: RegistrationIsEmbargoed) {
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
    }).drop(),
}) {
    @service i18n!: I18N;
    @service toast!: Toast;

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
