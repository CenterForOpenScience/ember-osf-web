import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class Institutions extends Route {
    @service store!: Store;

    model() {
        return this.store.findAll('institution');
    }
}
