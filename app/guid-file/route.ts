import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import File from 'ember-osf-web/models/file';
import User from 'ember-osf-web/models/user';
import { analyticPrivacy } from 'ember-osf-web/services/analytics';
import loadAll from 'ember-osf-web/utils/load-relationship';

export default class FileDetail extends Route.extend() {
    @service analytics;
    @service currentUser;

    async model(this: FileDetail, params) {
        try {
            const file: File = await this.store.findRecord('file', params.file_guid);
            const fileId = file.get('id');
            const fileUser: User = await file.get('user');
            const user: User = await fileUser.reload();
            const files: File[] = (await loadAll(user, 'quickfiles', { 'page[size]': 100 }))
                .map(item => {
                    item.set('isSelected', item.get('id') === fileId);
                    return item;
                });

            return {
                file,
                user,
                files,
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

    @action
    didTransition(this: FileDetail) {
        this.get('analytics').trackPage(analyticPrivacy.public, 'files');
    }
}
