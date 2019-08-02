import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
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

export default class UserQuickfiles extends Route.extend({
    setupController(controller: GuidUserQuickfilesController, model: any) {
        this._super(controller, model);

        controller.setProperties({
            newProject: this.get('store').createRecord('node', {
                public: true,
                category: 'project',
            }),
        });
    },
}) {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service ready!: Ready;
    @service router!: any;

    loadModel = task(function *(this: UserQuickfiles, userModel: any) {
        const blocker = this.get('ready').getBlocker();
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

    model(this: UserQuickfiles) {
        return {
            taskInstance: this.get('loadModel').perform(this.modelFor('guid-user')),
        };
    }

    @action
    didTransition(this: UserQuickfiles) {
        window.addEventListener('dragover', preventDrop);
        window.addEventListener('drop', preventDrop);

        this.analytics.trackPage(true, 'users');
    }
}
