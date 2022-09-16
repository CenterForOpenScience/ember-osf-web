import Transition from '@ember/routing/-private/transition';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Session from 'ember-simple-auth/services/session';

export default class Home extends Route {
  @service session!: Session;

  async beforeModel(transition: Transition) {
      await super.beforeModel(transition);

      if (this.session.isAuthenticated) {
          this.transitionTo('dashboard');
      }
  }
}
