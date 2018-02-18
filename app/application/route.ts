import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import OSFAgnosticAuthRouteMixin from 'ember-osf/mixins/osf-agnostic-auth-route';

export default class Application extends Route.extend(OSFAgnosticAuthRouteMixin) {
    moment = service('moment');

    beforeModel(...args) {
        this.get('moment').setTimeZone('UTC');

        return this._super(...args);
    }
}

declare module '@ember/routing/route' {
    interface IRegistry {
        application: Application;
    }
}
