import Controller from '@ember/controller';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';


export default class GuidNode extends Controller {
    @service router!: RouterService;

    get shouldHideNodeNavbar() {
        return this.router.currentRouteName === 'guid-node.files.provider';
    }
}
