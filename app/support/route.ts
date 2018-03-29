import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';

export default class Support extends Route {
    @service analytics;
    actions = {
        didTransition(this: Support) {
            this.get('analytics').trackPage();
        },
    };
}
