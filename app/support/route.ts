import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';

export default class Support extends Route {
    @service analytics;
    @service router;
    actions = {
        didTransition(this: Support) {
            const page = this.get('router').currentUrl;
            const title = this.get('routeName');
            const publicPrivate = 'n/a';
            const resourceType = 'n/a';
            this.get('analytics').trackPage(page, title, publicPrivate, resourceType);
        },
    };
}
