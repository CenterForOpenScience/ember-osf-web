import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import { analyticPrivacy } from 'ember-osf-web/services/analytics';

export default class FileDetail extends Route.extend() {
    @service currentUser;
    @service analytics;
    actions = {
        didTransition(this: FileDetail) {
            const publicPrivate = analyticPrivacy.public;
            const resourceType = 'files';
            this.get('analytics').trackPage(publicPrivate, resourceType);
        },
    };

    async model(this: FileDetail, params) {
        try {
            const file = await this.store.findRecord('file', params.file_guid);
            const fileUser = await file.get('user');
            const user = await fileUser.reload();

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
