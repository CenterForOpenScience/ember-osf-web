import Controller from '@ember/controller';
import config from 'ember-get-config';
import OSFAgnosticAuthControllerMixin from 'ember-osf-web/mixins/osf-agnostic-auth-controller';
import pathJoin from 'ember-osf-web/utils/path-join';
import $ from 'jquery';

export default class Application extends Controller.extend(OSFAgnosticAuthControllerMixin) {
    signupUrl = `${pathJoin(config.OSF.url, 'register')}?${$.param({ next: window.location.href })}`;
}

declare module '@ember/controller' {
    interface IRegistry {
        application: Application;
    }
}
