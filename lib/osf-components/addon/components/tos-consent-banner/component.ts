import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { dropTask } from 'ember-concurrency';
import config from 'ember-osf-web/config/environment';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

import styles from './styles';
import template from './template';

const {
    signUpPolicy: { termsLink, privacyPolicyLink },
} = config;

@layout(template, styles)
@tagName('')
export default class TosConsentBanner extends Component {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service intl!: Intl;
    @service toast!: Toast;

    // Private properties
    show = false;
    didValidate = false;
    hasSubmitted = false;
    termsLink = termsLink;
    privacyPolicyLink = privacyPolicyLink;

    @dropTask
    @waitFor
    async saveUser() {
        const { user } = this.currentUser;
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
        return true;
    }
}
