import Controller from '@ember/controller';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';
import CurrentUser from 'ember-osf-web/services/current-user';
import Theme from 'ember-osf-web/services/theme';
import pathJoin from 'ember-osf-web/utils/path-join';
import $ from 'jquery';

const {
    featureFlagNames: {
        routes: routeFlags,
    },
} = config;

export default class Application extends Controller {
    @service currentUser!: CurrentUser;
    @service theme!: Theme;
    @service features!: Features;

    @alias('theme.provider.currentUserCanReview') currentUserIsModerator?: Boolean;

    signupUrl = `${pathJoin(config.OSF.url, 'register')}?${$.param({ next: window.location.href })}`;

    get isDisplayModerationButton() {
        const moderationFlag = routeFlags['collections.moderation'];
        return this.currentUserIsModerator && this.features.isEnabled(moderationFlag);
    }

    @action
    login() {
        this.currentUser.login();
    }
}

declare module '@ember/controller' {
    interface Registry {
        'collections/application': Application;
    }
}
