import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Analytics from 'ember-osf/mixins/analytics';
import { hash } from 'rsvp';

export default class FileDetail extends Route.extend(Analytics) {
    private currentUser = service('currentUser');

    private async model({ file_id }) {
        const file = await this.store.findRecord('file', file_id);
        const fileUser = await file.get('user');
        const user = await fileUser.reload();

        return {
            file,
            user,
        };
    }

    private resetController(controller, isExiting, transition) {
        if (isExiting && transition.targetName !== 'error') {
            controller.set('revision', null);
        }
    }
}

declare module '@ember/routing/route' {
    interface IRegistry {
        'file-detail': FileDetail;
    }
}
