import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';

import Ready from 'ember-osf-web/services/ready';

export default class GuidNodeForks extends Route {
    @service ready!: Ready;

    model(this: GuidNodeForks) {
        return this.modelFor('guid-node');
    }
}
