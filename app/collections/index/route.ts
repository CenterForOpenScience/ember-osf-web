import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DS from 'ember-data';

export default class Index extends Route {
    @service store!: DS.Store;

    model() {
        return this.store.findAll('collection-provider');
    }
}
