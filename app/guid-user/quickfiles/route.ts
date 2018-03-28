import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

function preventDrop(e: DragEvent) {
    if ((e.target as HTMLDivElement).id === 'quickfiles-dropzone') {
        return;
    }

    e.preventDefault();
    e.dataTransfer.effectAllowed = 'none';
    e.dataTransfer.dropEffect = 'none';
}

export default class UserQuickfiles extends Route.extend({
    analytics: service(),
    router: service(),

    actions: {
        didTransition(this: UserQuickfiles) {
            window.addEventListener('dragover', preventDrop);
            window.addEventListener('drop', preventDrop);

            this.controller.get('model').taskInstance.then(() => {
                const page = this.get('router').currentUrl;
                const title = this.get('routeName');
                const publicPrivate = 'public';
                this.get('analytics').trackPage(page, title, publicPrivate);
            });
        },
    },
}) {
    currentUser = service('current-user');

    model(this: UserQuickfiles) {
        return this.modelFor('guid-user');
    }
}
