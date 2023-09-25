import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import CurrentUserService from 'ember-osf-web/services/current-user';
import { restartableTask } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import config from 'ember-get-config';
import IntlService from 'ember-intl/services/intl';

import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

const { support: { supportEmail } } = config;

export default class OptOutComponent extends Component {
    @service currentUser!: CurrentUserService;
    @service intl!: IntlService;
    @service toast!: Toastr;

    @tracked indexingPreference?: boolean;

    get allowIndexingIsFalse() {
        // allowIndexing is null by default
        return this.currentUser.user?.allowIndexing === false;
    }

    constructor(owner: unknown, args: any) {
        super(owner, args);
        this.indexingPreference = this.currentUser.user?.allowIndexing;
    }

    @restartableTask
    @waitFor
    async updateIndexingPreference() {
        if (!this.currentUser.user) {
            return;
        }
        try {
            this.currentUser.user.allowIndexing = this.indexingPreference;
            await this.currentUser.user.save();
            this.toast.success(this.intl.t('settings.account.opt-out.success'));
        } catch (e) {
            const errorMessage = this.intl.t(
                'settings.account.opt-out.error',
                { supportEmail, htmlSafe: true },
            );
            captureException(e, { errorMessage: errorMessage.toString() });
            this.toast.error(getApiErrorMessage(e), errorMessage as string);
        }
    }
}
