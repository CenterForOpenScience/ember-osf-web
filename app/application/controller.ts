import { action } from '@ember-decorators/object';
import { match } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import { Registry as Services } from '@ember/service';
import config from 'ember-get-config';
import CurrentUser from 'ember-osf-web/services/current-user';
import Theme from 'ember-osf-web/services/theme';
import pathJoin from 'ember-osf-web/utils/path-join';
import $ from 'jquery';

export default class Application extends Controller {
    @service currentUser!: CurrentUser;
    @service router!: Services['router'];
    @service theme!: Theme;

    secondaryNavbarId = config.secondaryNavbarId;
    signupUrl = `${pathJoin(config.OSF.url, 'register')}?${$.param({ next: window.location.href })}`;

    // This is a hack until we refactor the nav bar/page headers to be customizable by routes.
    @match('router.currentRouteName', /^handbook/) disableHeaders!: boolean;

    @action
    login() {
        this.currentUser.login();
    }
}

declare module '@ember/controller' {
    interface Registry {
        application: Application;
    }
}
