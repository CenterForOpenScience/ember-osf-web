import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import Ember from 'ember';
import DS from 'ember-data';

export default class ResolveGuid extends Route {
    @service store!: DS.Store;

    async model(this: ResolveGuid, params: { guid: string }, transition: Ember.Transition): Promise<void> {
        // Block until the Guid is resolved, then always transition somewhere else.
        try {
            const guid = await this.store.findRecord('guid', params.guid);
            transition.abort();
            this.transitionTo(`guid-${guid.referentType}${this.routeName.replace(/^resolve-guid/, '')}`, guid.id);
        } catch (error) {
            this.transitionTo('not-found', params.guid);
        }
    }
}
