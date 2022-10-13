import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';

const {
    featureFlagNames: {
        routes: routeFlags,
    },
} = config;

export default class Moderation extends Route {
    @service features!: Features;

    beforeModel() {
        const moderationFlag = routeFlags['collections.moderation'];
        // check if this user is a moderator
        if (!this.features.isEnabled(moderationFlag)) {
            this.transitionTo('page-not-found');
        }
    }
}
