import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { localClassNames } from 'ember-css-modules';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import captureException from 'ember-osf-web/utils/capture-exception';

import styles from './styles';
import template from './template';

@layout(template, styles)
@localClassNames('TosConsentBanner')
export default class TosConsentBanner extends Component {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;

    // Private properties
    show = false;
    didValidate = false;
    hasSubmitted = false;

    @task({ drop: true })
    saveUser = task(function *(this: TosConsentBanner) {
        const user = yield this.currentUser.user;
        const { validations } = yield user.validate();
        this.set('didValidate', true);

        if (!validations.isValid) {
            return;
        }

        try {
            yield user.save();
        } catch (e) {
            captureException(e);
        }

        this.currentUser.set('showTosConsentBanner', false);
    });

    constructor(properties: object) {
        super(properties);
        Object.assign(this, config.signUpPolicy);
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
