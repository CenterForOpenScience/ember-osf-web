import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import Store from '@ember-data/store';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';
import requireAuth from 'ember-osf-web/decorators/require-auth';
import Theme from 'ember-osf-web/services/theme';

@requireAuth()
export default class PreprintSelectRoute extends Route {
    @service store!: Store;
    @service theme!: Theme;

    async model(){
        const submissionProviders: PreprintProviderModel[] = await this.store.findAll('preprint-provider', {
            reload: true,
            adapterOptions: { 'filter[allowSubmissions]': 'true' },
        });

        this.theme.reset();

        return {
            submissionProviders,
        };
    }
}
