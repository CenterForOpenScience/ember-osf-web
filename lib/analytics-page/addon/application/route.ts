import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { assert } from '@ember/debug';
import Route from '@ember/routing/route';
import Transition from '@ember/routing/transition';
import { task, TaskInstance } from 'ember-concurrency';
import DS from 'ember-data';

import Node from 'ember-osf-web/models/node';
import AnalyticsService from 'ember-osf-web/services/analytics';
import Ready, { Blocker } from 'ember-osf-web/services/ready';

export default class AnalyticsPageRoute extends Route {
    @service analytics!: AnalyticsService;
    @service ready!: Ready;
    @service store!: DS.Store;

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

    model(this: AnalyticsPageRoute, _: {}, transition: Transition) {
        const guidHandlerInfo = transition.handlerInfos.find(
            handlerInfo => Boolean(handlerInfo.params) && 'guid' in handlerInfo.params!,
        )!;

        assert('A parent route must have a dynamic segment ":guid"', Boolean(guidHandlerInfo));

        const model = transition.resolvedModels[guidHandlerInfo.name]!;

        assert(
            'Guid Routes\' models must have a taskInstance property that is a TaskInstance',
            // Can't test instanceof TaskInstance so just do a bit of shape checking
            model.taskInstance && model.taskInstance.isRunning !== undefined,
        );

        return this.get('getNodeWithCounts').perform(model.taskInstance);
    }

    @action
    didTransition() {
        this.analytics.trackPage(true, (this as any).currentModel.modelName);
    }
}
