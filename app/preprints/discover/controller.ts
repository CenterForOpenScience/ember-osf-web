
import Store from '@ember-data/store';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class PreprintDiscoverController extends Controller {
    @service store!: Store;
}
