import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Analytics from 'ember-osf/mixins/analytics';

export default class UserQuickfiles extends Route.extend(Analytics) {
    private currentUser = service('currentUser');

    private actions = {
        didTransition(this: UserQuickfiles) {
            window.addEventListener('dragover', this.preventDrop);
            window.addEventListener('drop', this.preventDrop);
        },
    };

    private model(params) {
        return this.store.findRecord('user', params.user_id);
    }

    private preventDrop(e) {
        if (e.target.id === 'quickfiles-dropzone') {
            return;
        }

        e.preventDefault();
        e.dataTransfer.effectAllowed = 'none';
        e.dataTransfer.dropEffect = 'none';
    }
}

declare module '@ember/routing/route' {
    interface IRegistry {
        'user-quickfiles': UserQuickfiles;
    }
}
