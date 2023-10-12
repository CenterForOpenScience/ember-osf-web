import Transition from '@ember/routing/-private/transition';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';

import Session from 'ember-simple-auth/services/session';

import RegisterController from './controller';

export default class Register extends Route {
    @service session!: Session;
    @service store!: Store;

    async beforeModel(transition: Transition) {
        await super.beforeModel(transition);

        if (this.session.isAuthenticated) {
            this.transitionTo('dashboard');
        }
    }

    model() {
        return this.store.createRecord('user-registration');
    }

    setupController(controller: RegisterController, model: any, transition: Transition) {
        super.setupController(controller, model, transition);
        controller.setup();
    }
}
