import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DS from 'ember-data';

import config from 'ember-get-config';

import Analytics from 'ember-osf-web/services/analytics';

const {
    OSF: {
        osfRegistrationProviderId,
    },
} = config;

export default class ApplicationRoute extends Route {
    @service analytics!: Analytics;
    @service store!: DS.Store;

    model() {
        return this.store.findRecord('registration-provider', String(osfRegistrationProviderId), { include: 'brand' });
    }
}
