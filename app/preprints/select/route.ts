import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import Store from '@ember-data/store';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';


export default class PreprintSelectRoute extends Route {
    @service store!: Store;

    async model(){
        const allProviders: PreprintProviderModel[] = await this.store.findAll('preprint-provider', {reload: true});
        const submissionProviders: PreprintProviderModel[] = allProviders.filter(item => item.allowSubmissions);
        return {
            submissionProviders,
        };
    }
}
