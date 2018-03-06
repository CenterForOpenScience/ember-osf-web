import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ResolveGuid extends Route.extend({
}) {
    store = service('store');

    async model(this: ResolveGuid, params: { guid: string }): void {
        // Block until the Guid is resolved, then always transition somewhere else.
        try {
            const guid = await this.get('store').findRecord('guid', params.guid);
            this.transitionTo(`guid-${guid.get('referentType')}`, guid.get('id'));
        } catch (error) {
            this.transitionTo('not-found', params.guid);
            throw error;
        }
    }
}
