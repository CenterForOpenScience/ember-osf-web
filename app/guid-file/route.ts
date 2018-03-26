import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class FileDetail extends Route.extend() {
    currentUser = service('currentUser');

    async model(params, transition) {
        const trans = transition;
        try {
            const file = await this.store.findRecord('file', params.file_guid);
            const fileUser = await file.get('user');
            const user = await fileUser.reload();
            const page = trans.intent.url;
            const title = trans.targetName;
            const publicPrivate = 'public';
            const resourceType = 'files';
            this.get('analytics').trackPage(page, title, publicPrivate, resourceType);

            return {
                file,
                user,
            };
        } catch (error) {
            this.transitionTo('not-found', params.file_guid);
            throw error;
        }
    }

    resetController(controller, isExiting, transition) {
        if (isExiting && transition.targetName !== 'error') {
            controller.set('revision', null);
        }
    }
}
