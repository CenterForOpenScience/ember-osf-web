import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Features from 'ember-feature-flags/services/features';
import Theme from 'ember-osf-web/services/theme';
import config from 'ember-get-config';

const {
    featureFlagNames: {
        routes: routeFlags,
    },
} = config;

export default class Moderation extends Route {
    @service features!: Features;
    @service theme!: Theme;

    beforeModel() {
        const moderationFlag = routeFlags['collections.moderation'];
        if (!this.features.isEnabled(moderationFlag) || !this.theme.provider?.currentUserCanReview) {
            this.transitionTo('page-not-found');
        }
    }

    model() {
        return this.theme.provider;
    }
}
