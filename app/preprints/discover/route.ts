import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PreprintDiscoverRoute extends Route {
    @service store!: Store;

    async model(args: any) {
        return await this.store.findRecord('preprint-provider', args.provider_id);
    }
}
