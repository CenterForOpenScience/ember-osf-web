import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Store from '@ember-data/store';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

import FileProviderModel from 'ember-osf-web/models/file-provider';
import Registration from 'ember-osf-web/models/registration';
import { GuidRouteModel } from 'ember-osf-web/resolve-guid/guid-route';

export default class RegistrationFilesProviderRoute extends Route.extend({}) {
    @service store!: Store;

    @task
    @waitFor
    async fileProviderTask(overview: GuidRouteModel<Registration>, fileProviderId: string) {
        const registration = await overview.taskInstance;
        const fileProviders = await registration!.files;
        const provider = fileProviders.findBy('id', fileProviderId) as FileProviderModel;
        if (!provider) {
            const { href, origin } = window.location;
            const currentUrl = href.replace(origin, '');
            this.transitionTo('page-not-found', currentUrl.slice(1));
        }
        return provider;
    }

    model(params: { providerId: string }) {
        const overview: GuidRouteModel<Registration> = this.modelFor('overview');
        const fileProviderId = overview.guid + ':' + params.providerId;
        return {
            providerName: params.providerId,
            providerTask: taskFor(this.fileProviderTask).perform(overview, fileProviderId),
        };
    }
}
