import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class Support extends Route {
    analytics = service();
    routah = service('router');
    actions = {
        didTransition(this: Support) {
            const page = this.get('routah').currentUrl;
            const title = this.get('routeName');
            const publicPrivate = 'n/a';
            const resourceType = 'n/a';
            this.get('analytics').trackPage(page, title, publicPrivate, resourceType);
        },
    };
}
