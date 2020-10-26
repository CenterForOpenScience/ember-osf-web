import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { Task, TaskInstance } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import Toast from 'ember-toastr/services/toast';

import Analytics from 'ember-osf-web/services/analytics';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

export interface GuidRouteModel<T> {
    guid: string;
    taskInstance: TaskInstance<T>;
    task: Task<T>;
}

export default class BrandedModerationOverviewRoute extends Route {
    @service analytics!: Analytics;
    @service store!: DS.Store;
    @service toast!: Toast;

    templateName = 'overview';

    @task({ withTestWaiter: true })
    getModel = task(function *(this: BrandedModerationOverviewRoute, guid: string) {
        try {
            return yield this.store.findRecord('registration', guid, {
                include: ['registration_schema', 'bibliographic_contributors', 'identifiers', 'root', 'provider'],
                adapterOptions: {
                    query: {
                        related_counts: 'forks,comments,linked_nodes,linked_registrations,children,wikis',
                    },
                },
            });
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
            throw e;
        }
    });

    model(params: { providerId: string, guid: string }) {
        return {
            guid: params.guid,
            taskInstance: this.getModel.perform(params.guid),
            task: this.getModel,
        };
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
