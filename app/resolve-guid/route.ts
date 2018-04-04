import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';

export default class ResolveGuid extends Route {
    @service store;

    async model(this: ResolveGuid, params: { guid: string }, transition): Promise<void> {
        // Block until the Guid is resolved, then always transition somewhere else.
        try {
            const guid = await this.get('store').findRecord('guid', params.guid);
            transition.abort();
            this.transitionTo(`guid-${guid.get('referentType')}`, guid.get('id'));
        } catch (error) {
            this.transitionTo('not-found', params.guid);
        }
    }
}
