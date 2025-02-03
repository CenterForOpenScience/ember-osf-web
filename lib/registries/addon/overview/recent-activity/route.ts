import Store from '@ember-data/store';
import Route from '@ember/routing/route'; import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

export default class RecentActivityRoute extends Route {
    @service store!: Store;
    @service router!: RouterService;

    // async model(params: { recordId: string}) {
    async model() {
        const overview = this.modelFor('overview');
        const registration = await overview.taskInstance;

        const logs = await registration.queryHasMany('logs', {
            'page[size]': 20,
        });

        /*
        for(const log of logs) {
            console.log(log.params);
        }
            */

        return {
            logs,
        };
    }
}
