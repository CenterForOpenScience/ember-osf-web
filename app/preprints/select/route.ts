import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import Store from '@ember-data/store';


export default class PreprintSelectRoute extends Route {
    @service store!: Store;

    async model(){
        const allProviders = await this.store.findAll('preprint-provider', { reload: true });
        return {
            allProviders,
        };
    }
}
