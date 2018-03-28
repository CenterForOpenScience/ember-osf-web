import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import { task } from 'ember-concurrency';
import { analyticPrivacy } from 'ember-osf-web/services/analytics';
import loadAll from 'ember-osf-web/utils/load-relationship';

function preventDrop(e: DragEvent) {
    if ((e.target as HTMLDivElement).id === 'quickfiles-dropzone') {
        return;
    }

    e.preventDefault();
    e.dataTransfer.effectAllowed = 'none';
    e.dataTransfer.dropEffect = 'none';
}

export default class UserQuickfiles extends Route.extend({
    setupController(controller, model) {
        this._super(controller, model);

        controller.setProperties({
            newProject: this.get('store').createRecord('node', {
                public: true,
                category: 'project',
            }),
        });
    },
}) {
    @service analytics;
    @service currentUser;
    @service ready;

    loadModel = task(function* (this: UserQuickfiles, userModel) {
        const blocker = this.get('ready').block();
        try {
            const user = yield userModel.taskInstance;

            const model = {
                user,
                files: yield loadAll(user, 'quickfiles', { 'page[size]': 100 }),
            };
            blocker.done();
            return model;
        } catch (error) {
            blocker.errored(error);
            this.transitionTo('not-found', this.get('router.currentURL').slice(1));
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

        this.get('analytics').trackPage(analyticPrivacy.public);
    }
}
