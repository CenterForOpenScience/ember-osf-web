import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ModerationAll extends Route {
  @service store!: Store;

  model() {
      return this.store.findAll('collection-submission');
  }
}
