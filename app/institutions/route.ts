import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';

export default class Institutions extends Route {
    @service store;

    model() {
        return this.store.findAll('institution');
    }
}
