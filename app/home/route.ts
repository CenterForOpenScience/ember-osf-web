import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import Ember from 'ember';
import Session from 'ember-simple-auth/services/session';

import Analytics from 'ember-osf-web/services/analytics';

import Controller from './controller';

export default class Home extends Route {
    @service analytics!: Analytics;
    @service session!: Session;

    async beforeModel(this: Home, transition: Ember.Transition) {
        await super.beforeModel(transition);

        if (this.session.isAuthenticated) {
            this.transitionTo('dashboard');
        }
    }

    @action
    didTransition(this: Home) {
        this.get('analytics').trackPage();
    }

    resetController(controller: Controller, isExiting: boolean, _: Ember.Transition) {
        if (isExiting) {
            controller.set('goodbye', null);
        }
    }
}
