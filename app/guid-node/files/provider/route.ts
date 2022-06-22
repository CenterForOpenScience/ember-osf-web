import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';
import FileProviderModel from 'ember-osf-web/models/file-provider';
import NodeModel from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';
import { GuidRouteModel } from 'ember-osf-web/resolve-guid/guid-route';
import CurrentUser from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

export default class GuidNodeFilesProviderRoute extends Route.extend({}) {
    @service currentUser!: CurrentUser;
    @service intl!: Intl;
    @service toast!: Toast;

    @task
    @waitFor
    async fileProviderTask(guidRouteModel: GuidRouteModel<NodeModel>, fileProviderId: string) {
        const node = await guidRouteModel.taskInstance;
        try {
            const fileProviders = await node.queryHasMany(
                'files',
                {
                    'page[size]': 20,
                },
            );
            const provider = fileProviders.findBy('id', fileProviderId) as FileProviderModel;
            const hasWritePermission = node.currentUserPermissions.includes(Permission.Write);
            const isViewOnly = Boolean(this.currentUser.viewOnlyToken);
            return {provider, fileProviders, node, hasWritePermission, isViewOnly};
        } catch (e) {
            const errorMessage = this.intl.t(
                'osf-components.file-browser.errors.load_file_providers',
            );
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            return {};
        }
    }

    model(params: { providerId: string }) {
        const node = this.modelFor('guid-node');
        const fileProviderId = node.guid + ':' + params.providerId;
        return {
            node,
            providerName: params.providerId,
            providerTask: taskFor(this.fileProviderTask).perform(node, fileProviderId),
        };
    }
}
