import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

import checkAuth from 'ember-osf-web/decorators/check-auth';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';

@checkAuth
export default class ApplicationRoute extends Route.extend(
    /*
     * If this doesn't use `.extend()`, then `ApplicationRoute.reopen(...)`
     * will open the `Route` prototype and affect all routes.
     *
     * Prevent `session.restore()` from being called several times on every
     * transition by this injected `beforeModel`:
     * https://github.com/simplabs/ember-simple-auth/blob/1.6.0/addon/initializers/setup-session-restoration.js#L8
     */
) {
    @service intl!: Intl;
    @service currentUser!: CurrentUser;
    @service analytics!: Analytics;

    queryParams = {
        viewOnlyToken: {
            refreshModel: false,
        },
    };

    beforeModel() {
        return this.intl.setLocale('en-us');
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
