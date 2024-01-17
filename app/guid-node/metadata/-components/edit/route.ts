import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';


export default class GuidMetadataAddRoute extends Route {
    @service store!: Store;

    async model(params: { recordId: string}) {
        const target = await this.modelFor('guid-node.metadata').taskInstance;
        const record = await this.store.findRecord('preprint', Number(params.recordId));

        return {
            target,
            record,
        };
    }
}
