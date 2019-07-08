import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Transition from '@ember/routing/-private/transition';
import Route from '@ember/routing/route';
import Session from 'ember-simple-auth/services/session';

import Analytics from 'ember-osf-web/services/analytics';

export default class Home extends Route {
  @service analytics!: Analytics;
  @service session!: Session;

  async beforeModel(transition: Transition) {
      await super.beforeModel(transition);

      if (this.session.isAuthenticated) {
          this.transitionTo('dashboard');
      }
  }

  @action
  didTransition() {
      this.analytics.trackPage();
  }
}
