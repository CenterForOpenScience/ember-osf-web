import Store from '@ember-data/store';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import Transition from '@ember/routing/-private/transition';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task, TaskInstance } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import config from 'ember-get-config';

import Node from 'ember-osf-web/models/node';
import AnalyticsService from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import Ready, { Blocker } from 'ember-osf-web/services/ready';
import captureException from 'ember-osf-web/utils/capture-exception';

const { OSF: { apiUrl } } = config;

export const TIMESPANS = ['week', 'fortnight', 'month'] as const;
export type Timespan = (typeof TIMESPANS)[number];
function isValidTimespan(maybeTimespan: string): maybeTimespan is Timespan {
    return TIMESPANS.includes(maybeTimespan as Timespan);
}

export default class AnalyticsPageRoute extends Route {
    @service analytics!: AnalyticsService;
    @service currentUser!: CurrentUser;
    @service ready!: Ready;
    @service router!: RouterService;
    @service store!: Store;

    queryParams = {
        timespan: {
            refreshModel: true,
        },
    };

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

    @task
    @waitFor
    async loadChartsData(nodeTaskInstance: TaskInstance<Node>, timespan: string) {
        const node = await nodeTaskInstance;
        if (!node.public) {
            return null;
        }
        try {
            const responseJson = await this.currentUser.authenticatedAJAX({
                url: `${apiUrl}/_/metrics/query/node_analytics/${node.id}/${timespan}/`,
            });
            return responseJson.data.attributes;
        } catch (e) {
            captureException(e);
            throw e;
        }
    }

    model({timespan}: {timespan: string}, transition: Transition) {
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

        if (!isValidTimespan(timespan)) {
            this.router.transitionTo({ queryParams: { timespan: TIMESPANS[0] } });
            return null;
        }

        return {
            nodeId: model.guid,
            timespan,
            nodeWithCountsTaskInstance: taskFor(this.getNodeWithCounts).perform(model.taskInstance),
            chartsDataTaskInstance: taskFor(this.loadChartsData).perform(model.taskInstance, timespan),
        };
    }

    buildRouteInfoMetadata() {
        return {
            osfMetrics: {
                itemGuid: this.controller.model.nodeId as string,
            },
        };
    }

    @action
    async didTransition() {
        this.analytics.trackPage();
    }
}
