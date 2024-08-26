import Route from '@ember/routing/route';
import requireAuth from 'ember-osf-web/decorators/require-auth';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';

@requireAuth()
export default class PreprintsMyPreprintsRoute extends Route {
    @service store!: Store;

    async model() {
        const preprints = await this.store.findAll('preprint');
        return preprints;
    }
}
