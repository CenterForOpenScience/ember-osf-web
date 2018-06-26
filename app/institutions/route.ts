import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import DS from 'ember-data';

export default class Institutions extends Route {
    @service store!: DS.Store;

    model() {
        return this.store.findAll('institution');
    }
}
