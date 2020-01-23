import { assert } from '@ember/debug';
import { action } from '@ember/object';
import Transition from '@ember/routing/-private/transition';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { TaskInstance } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import { pluralize } from 'ember-inflector';

import Node from 'ember-osf-web/models/node';
import { GuidRouteModel } from 'ember-osf-web/resolve-guid/guid-route';
import AnalyticsService from 'ember-osf-web/services/analytics';
import Ready, { Blocker } from 'ember-osf-web/services/ready';

export default class AnalyticsPageRoute extends Route {
    @service analytics!: AnalyticsService;
    @service ready!: Ready;
    @service store!: DS.Store;

    @task
    reloadNode = task(function *(this: AnalyticsPageRoute, model: Node, blocker: Blocker) {
        const node = yield model.reload({
            adapterOptions: {
                query: {
                    related_counts: true,
                },
            },
        });

        blocker.done();

        return node;
    });

    @task
    getNodeWithCounts = task(function *(this: AnalyticsPageRoute, taskInstance: TaskInstance<Node>) {
        const blocker = this.ready.getBlocker();

        const node = yield taskInstance;

        assert('A parent route must have Node based model', node instanceof Node);

        return {
            id: node.id,
            modelName: node.modelName,
            taskInstance: this.get('reloadNode').perform(node, blocker),
        };
    });

    model(_: {}, transition: Transition) {
        const guidRouteInfo = transition.routeInfos.find(
            routeInfo => Boolean(routeInfo.params) && 'guid' in routeInfo.params!,
        )!;

        assert('A parent route must have a dynamic segment ":guid"', Boolean(guidRouteInfo));

        const model = transition.resolvedModels[guidRouteInfo.name]!;

        assert(
            'Guid Routes\' models must have a taskInstance property that is a TaskInstance',
            // Can't test instanceof TaskInstance so just do a bit of shape checking
            model.taskInstance && model.taskInstance.isRunning !== undefined,
        );

        return this.getNodeWithCounts.perform(model.taskInstance);
    }

    @action
    async didTransition() {
        const { taskInstance } = this.controller.model as GuidRouteModel<Node>;
        await taskInstance;
        const model = taskInstance.value;
        this.analytics.trackPage(
            model ? model.public : undefined,
            model ? pluralize(model.modelName) : undefined,
        );
    }
}
