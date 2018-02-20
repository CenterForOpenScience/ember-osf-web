import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Analytics from 'ember-osf-web/mixins/analytics';

function preventDrop(e: DragEvent) {
    if ((e.target as HTMLDivElement).id === 'quickfiles-dropzone') {
        return;
    }

    e.preventDefault();
    e.dataTransfer.effectAllowed = 'none';
    e.dataTransfer.dropEffect = 'none';
}

export default class UserQuickfiles extends Route.extend(Analytics, {
    actions: {
        didTransition(this: UserQuickfiles) {
            window.addEventListener('dragover', preventDrop);
            window.addEventListener('drop', preventDrop);
        },
    },
}) {
    currentUser = service('currentUser');

    model(params) {
        return this.store.findRecord('user', params.user_id);
    }
}

declare module '@ember/routing/route' {
    interface IRegistry {
        'user-quickfiles': UserQuickfiles;
    }
}
