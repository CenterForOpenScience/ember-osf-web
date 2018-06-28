import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';

import featureFlagRoute from 'ember-osf-web/decorators/feature-flag-route';
import Ready from 'ember-osf-web/services/ready';

@featureFlagRoute()
export default class GuidNodeForks extends Route {
    @service ready!: Ready;

    model(this: GuidNodeForks) {
        return this.modelFor('guid-node');
    }
}
