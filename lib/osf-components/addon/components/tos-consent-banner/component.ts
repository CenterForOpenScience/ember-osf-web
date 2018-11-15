import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { localClassNames } from 'ember-css-modules';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';

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

    saveUser = task(function *(this: TosConsentBanner) {
        const user = yield this.currentUser.user;
        const { validations } = yield user.validate();
        this.set('didValidate', true);

        if (!validations.isValid) {
            return;
        }

        yield user.save();
        this.currentUser.set('showTosConsentBanner', false);
    }).drop();

    constructor(properties: object) {
        super(properties);
        Object.assign(this, config.signUpPolicy);
    }

    init(this: TosConsentBanner) {
        super.init();
        this.currentUser.checkShowTosConsentBanner();
    }

    @action
    dismiss(this: TosConsentBanner) {
        this.analytics.click('button', 'ToS Consent Banner - dismiss');
        this.set('didValidate', false);
        this.currentUser.set('showTosConsentBanner', false);
        return false;
    }
}
