import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Analytics from 'ember-osf-web/mixins/analytics';

export default class FileDetail extends Route.extend(Analytics) {
    currentUser = service('currentUser');
    prerender = service('prerender');

    async model(params) {
        const prerender = this.get('prerender');
        prerender.waitOn(this.routeName);
        try {
            const file = await this.store.findRecord('file', params.file_guid);
            const fileUser = await file.get('user');
            const user = await fileUser.reload();

            prerender.finished(this.routeName);
            return {
                file,
                user,
            };
        } catch (error) {
            this.transitionTo('not-found', id);
            throw error;
        }
    }

    resetController(controller, isExiting, transition) {
        if (isExiting && transition.targetName !== 'error') {
            controller.set('revision', null);
        }
    }
}
