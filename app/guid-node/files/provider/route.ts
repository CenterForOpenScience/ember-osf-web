import Route from '@ember/routing/route';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

import FileProviderModel from 'ember-osf-web/models/file-provider';
import NodeModel from 'ember-osf-web/models/node';
import { GuidRouteModel } from 'ember-osf-web/resolve-guid/guid-route';

export default class GuidNodeFilesProviderRoute extends Route.extend({}) {
    @task
    @waitFor
    async fileProviderTask(guidRouteModel: GuidRouteModel<NodeModel>, fileProviderId: string) {
        const node = await guidRouteModel.taskInstance;
        const fileProviders = await node.files;
        const provider = fileProviders.findBy('id', fileProviderId) as FileProviderModel;
        return provider;
    }

    model(params: { providerId: string }) {
        const node = this.modelFor('guid-node');
        const fileProviderId = node.guid + ':' + params.providerId;
        return {
            providerName: params.providerId,
            providerTask: taskFor(this.fileProviderTask).perform(node, fileProviderId),
        };
    }
}
