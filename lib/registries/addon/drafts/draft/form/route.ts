import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import Store from 'ember-data/store';
import RegistrationSchemaModel from 'ember-osf-web/models/registration-schema';
import Analytics from 'ember-osf-web/services/analytics';
import FormController from './controller';

export default class DraftsFormRoute extends Route {
    @service analytics!: Analytics;
    @service store!: Store;

    model() {
        return this.store.findRecord('registration-schema', 'as_predicted_preregsitration');
    }

    setupController(controller: FormController, model: RegistrationSchemaModel) {
        super.setupController(controller, model);
        controller.setBreaks();
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
