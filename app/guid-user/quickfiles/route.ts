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
    actions: {
        didTransition(this: UserQuickfiles) {
            window.addEventListener('dragover', preventDrop);
            window.addEventListener('drop', preventDrop);
        },
    },
}) {
    currentUser = service('currentUser');
    analytics = service();
    afterModel(this: UserQuickfiles, model, transition) {
        const trans = transition;
        super.afterModel(model, trans);
        model.taskInstance.then(() => {
            const page = trans.intent.url;
            const title = trans.targetName;
            const publicPrivate = 'public';
            const resourceType = 'n/a';
            this.get('analytics').trackPage(page, title, publicPrivate, resourceType);
        });
    }
    model(this: UserQuickfiles) {
        return this.modelFor('guid-user');
    }
}
