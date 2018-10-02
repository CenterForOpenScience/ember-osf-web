import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import config from 'ember-get-config';
import CurrentUser from 'ember-osf-web/services/current-user';
import pathJoin from 'ember-osf-web/utils/path-join';
import $ from 'jquery';

export default class Application extends Controller {
    @service currentUser!: CurrentUser;

    signupUrl = `${pathJoin(config.OSF.url, 'register')}?${$.param({ next: window.location.href })}`;

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
