import Controller from '@ember/controller';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

export default class CollectionsModerationModeratorsController extends Controller {
    @service router!: RouterService;

    @action
    afterSelfRemoval() {
        this.transitionToRoute('provider.discover', this.model.id);
    }
}
