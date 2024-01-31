import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';

export default class AddonConfirmController extends Controller {
    @service media!: Media;
    @service router!: RouterService;

    @action
    confirmAccount() {
        this.router.transitionTo('guid-node.addons.addon.configure');
    }

    @action
    cancel() {
        this.router.transitionTo('guid-node.addons');
    }
}
