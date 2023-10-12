import Controller from '@ember/controller';
import { reads } from '@ember/object/computed';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import Token from 'ember-osf-web/models/token';
import Analytics from 'ember-osf-web/services/analytics';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';

export default class SettingsTokensEditController extends Controller {
    @service analytics!: Analytics;
    @service intl!: Intl;
    @service router!: RouterService;
    @service toast!: Toast;

    deleteModalShown = false;

    @reads('model.taskInstance.value')
    token?: Token;

    @task
    @waitFor
    async refreshToken() {
        this.clearTokenValue();

        // Send action to route
        this.send('refreshRoute');
    }

    clearTokenValue() {
        if (this.token && this.token.tokenValue) {
            this.token.unloadRecord();
        }
    }
}
