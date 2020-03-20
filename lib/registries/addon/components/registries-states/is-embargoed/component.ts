import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Registration from 'ember-osf-web/models/registration';
import captureException from 'ember-osf-web/utils/capture-exception';
import template from './template';

@layout(template)
export default class RegistrationIsEmbargoed extends Component {
    @service intl!: Intl;
    @service toast!: Toast;

    @task({ drop: true })
    endEmbargo = task(function *(this: RegistrationIsEmbargoed) {
        if (!this.registration) {
            return;
        }

        this.registration.set('public', true);

        try {
            yield this.registration.save();
        } catch (e) {
            captureException(e);
            this.toast.error(this.intl.t('registries.overview.embargoed.action_error'));
        }

        this.toast.success(this.intl.t('registries.overview.embargoed.action_success'));

        this.close();
    });

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
