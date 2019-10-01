import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import DS from 'ember-data';

import Analytics from 'ember-osf-web/services/analytics';

export default class InstitutionsDashboardController extends Controller {
    @service store!: DS.Store;
    @service analytics!: Analytics;
}

declare module '@ember/controller' {
    interface Registry {
        'institutions-dashboard': InstitutionsDashboardController;
    }
}
