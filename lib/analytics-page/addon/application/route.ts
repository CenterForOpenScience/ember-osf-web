import Store from '@ember-data/store';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import Transition from '@ember/routing/-private/transition';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task, TaskInstance } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

import Node from 'ember-osf-web/models/node';
import AnalyticsService from 'ember-osf-web/services/analytics';
import Ready, { Blocker } from 'ember-osf-web/services/ready';

export default class AnalyticsPageRoute extends Route {
    @service analytics!: AnalyticsService;
    @service ready!: Ready;
    @service store!: Store;

    @task
    @waitFor
    async reloadNode(model: Node, blocker: Blocker) {
        const node = await model.reload({
            adapterOptions: {
                query: {
                    related_counts: true,
                },
            },
        });

        blocker.done();

        return node;
    }

    @task
    @waitFor
    async getNodeWithCounts(taskInstance: TaskInstance<Node>) {
        const blocker = this.ready.getBlocker();

        const node = await taskInstance;

        assert('A parent route must have Node based model', node instanceof Node);

        return {
            id: node.id,
            modelName: node.modelName,
            taskInstance: taskFor(this.reloadNode).perform(node, blocker),
        };
    }

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

        return taskFor(this.getNodeWithCounts).perform(model.taskInstance);
    }

    buildRouteInfoMetadata() {
        return {
            osfMetrics: {
                itemGuid: (this.controller as any).model.id as string,
            },
        };
    }

    @action
    async didTransition() {
        this.analytics.trackPage();
    }
}
