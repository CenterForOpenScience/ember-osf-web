import Controller from '@ember/controller';
import config from 'ember-get-config';
import OsfAuthenticatedControllerMixin from 'ember-osf-web/mixins/osf-authenticated-controller';
import pathJoin from 'ember-osf-web/utils/path-join';
import $ from 'jquery';

export default class Application extends Controller.extend(OsfAuthenticatedControllerMixin) {
    secondaryNavbarId = config.secondaryNavbarId;
    signupUrl = `${pathJoin(config.OSF.url, 'register')}?${$.param({ next: window.location.href })}`;
}

declare module '@ember/controller' {
    interface Registry {
        application: Application;
    }
}
