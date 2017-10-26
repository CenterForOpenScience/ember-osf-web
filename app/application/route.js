import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import OSFAgnosticAuthRouteMixin from 'ember-osf/mixins/osf-agnostic-auth-route';

export default Route.extend(OSFAgnosticAuthRouteMixin, {
    moment: service(),
    beforeModel() {
        this.get('moment').setTimeZone('UTC');
    },
});
