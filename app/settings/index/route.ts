import Route from '@ember/routing/route';

import requireAuth from 'ember-osf-web/decorators/require-auth';

@requireAuth()
export default class SettingsIndexRoute extends Route {
    beforeModel() {
        this.transitionTo('settings.profile.name');
    }
}
