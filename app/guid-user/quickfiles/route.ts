import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

import GuidUserQuickfilesController from 'ember-osf-web/guid-user/quickfiles/controller';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import Ready from 'ember-osf-web/services/ready';
import { notFoundURL } from 'ember-osf-web/utils/clean-url';

function preventDrop(e: DragEvent) {
    if ((e.target as HTMLDivElement).id === 'quickfiles-dropzone') {
        return;
    }

    e.preventDefault();
    e.dataTransfer!.effectAllowed = 'none';
    e.dataTransfer!.dropEffect = 'none';
}

export default class UserQuickfiles extends Route {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service ready!: Ready;
    @service router!: any;

    @task({ withTestWaiter: true })
    loadModel = task(function *(this: UserQuickfiles, userModel: any) {
        const blocker = this.ready.getBlocker();
        try {
            const user = yield userModel.taskInstance;

            const model = {
                user,
                files: yield user.loadAll('quickfiles'),
            };
            blocker.done();
            return model;
        } catch (error) {
            blocker.errored(error);
            this.replaceWith('not-found', notFoundURL(this.router.currentURL));
            return undefined;
        }
    });

    model() {
        return {
            taskInstance: this.loadModel.perform(this.modelFor('guid-user')),
        };
    }

    setupController(controller: GuidUserQuickfilesController, model: any, transition: any) {
        super.setupController(controller, model, transition);

        controller.setProperties({
            newProject: this.store.createRecord('node', {
                public: true,
                category: 'project',
            }),
        });
    }

    @action
    didTransition() {
        window.addEventListener('dragover', preventDrop);
        window.addEventListener('drop', preventDrop);

        this.analytics.trackPage(true, 'users');
    }
}
