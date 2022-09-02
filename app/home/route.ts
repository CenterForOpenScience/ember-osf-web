import Transition from '@ember/routing/-private/transition';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';
import Session from 'ember-simple-auth/services/session';

import Analytics from 'ember-osf-web/services/analytics';

const { featureFlagNames: { ABTesting } } = config;

export default class Home extends Route {
  @service analytics!: Analytics;
  @service session!: Session;
  @service features!: Features;

  async beforeModel(transition: Transition) {
      await super.beforeModel(transition);

      if (this.session.isAuthenticated) {
          this.transitionTo('dashboard');
      }
  }

  buildRouteInfoMetadata() {
      const shouldShowVersionB = this.features.isEnabled(ABTesting.homePageHeroTextVersionB);
      const abVersion = shouldShowVersionB ? 'versionB' : 'versionA';
      return {
          analyticsMeta: { abVersion },
      };
  }
}
