import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import Provider from 'ember-osf-web/packages/addons-service/provider';

export default class AccountTermsController extends Controller {
    @service media!: Media;
    @service router!: RouterService;

    @action
    acceptTerms() {
        const provider = this.model.taskInstance.value as Provider;
        provider.acceptTerms();
        this.router.transitionTo('guid-node.addons.addon.account');
    }

    @action
    cancel() {
        this.router.transitionTo('guid-node.addons');
    }
}
