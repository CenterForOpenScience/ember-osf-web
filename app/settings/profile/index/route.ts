import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';

import requireAuth from 'ember-osf-web/decorators/require-auth';

const {
    featureFlagNames: {
        routes: routeFlags,
    },
} = config;

@requireAuth()
export default class SettingsProfileIndexRoute extends Route {
    @service features!: Features;
    beforeModel() {
        const flag = routeFlags['settings.profile'];
        if (flag && !this.get('features').isEnabled(flag)) {
            try {
                window.location.assign('/settings/');
            } catch (e) {
                window.location.reload();
            }
            return;
        }
        this.transitionTo('settings.profile.name');
    }
}
