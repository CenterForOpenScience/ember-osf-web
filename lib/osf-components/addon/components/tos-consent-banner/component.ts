import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency-decorators';
import { localClassNames } from 'ember-css-modules';
import config from 'ember-get-config';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

import styles from './styles';
import template from './template';

@layout(template, styles)
@localClassNames('TosConsentBanner')
export default class TosConsentBanner extends Component {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service intl!: Intl;
    @service toast!: Toast;

    // Private properties
    show = false;
    didValidate = false;
    hasSubmitted = false;

    constructor(properties: object) {
        super(properties);
        Object.assign(this, config.signUpPolicy);
    }

    @dropTask({ withTestWaiter: true })
    async saveUser() {
        const user = await this.currentUser.user;
        const { validations } = await user!.validate();
        this.set('didValidate', true);

        if (!validations.isValid) {
            return;
        }

        try {
            await user!.save();
        } catch (e) {
            const errorMessage = this.intl.t('tos_consent.failed_save');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
        }

        this.currentUser.set('showTosConsentBanner', false);
    }

    init() {
        super.init();
        this.currentUser.checkShowTosConsentBanner();
    }

    @action
    dismiss() {
        this.analytics.click('button', 'ToS Consent Banner - dismiss');
        this.set('didValidate', false);
        this.currentUser.set('showTosConsentBanner', false);
        return false;
    }
}
